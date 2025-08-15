import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WebRTCCallProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  participantName: string;
  currentUserId: string;
  otherUserId: string;
}

interface CallState {
  isConnected: boolean;
  isConnecting: boolean;
  isIncoming: boolean;
  micEnabled: boolean;
  videoEnabled: boolean;
  speakerEnabled: boolean;
}

const WebRTCCall: React.FC<WebRTCCallProps> = ({
  isOpen,
  onClose,
  conversationId,
  participantName,
  currentUserId,
  otherUserId
}) => {
  const { toast } = useToast();
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isConnecting: false,
    isIncoming: false,
    micEnabled: true,
    videoEnabled: true,
    speakerEnabled: true
  });

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);

  // WebRTC configuration with STUN servers
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  // Initialize WebRTC connection
  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callState.videoEnabled,
        audio: callState.micEnabled
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'ice-candidate',
            payload: {
              candidate: event.candidate,
              conversationId,
              fromUserId: currentUserId
            }
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        setCallState(prev => ({
          ...prev,
          isConnected: peerConnection.connectionState === 'connected',
          isConnecting: peerConnection.connectionState === 'connecting'
        }));
      };

      return peerConnection;
    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      toast({
        title: "Camera/Microphone Error",
        description: "Unable to access camera or microphone. Please check permissions.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Set up Supabase realtime channel for signaling
  useEffect(() => {
    if (!isOpen) return;

    const channel = supabase.channel(`call-${conversationId}`, {
      config: {
        broadcast: { self: true }
      }
    });

    channelRef.current = channel;

    // Listen for call signals
    channel.on('broadcast', { event: 'call-offer' }, async (payload) => {
      if (payload.payload.toUserId === currentUserId) {
        setCallState(prev => ({ ...prev, isIncoming: true }));
        
        toast({
          title: "Incoming Call",
          description: `${participantName} is calling you`,
          duration: 10000
        });
      }
    });

    channel.on('broadcast', { event: 'call-answer' }, async (payload) => {
      if (payload.payload.toUserId === currentUserId && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(payload.payload.answer);
      }
    });

    channel.on('broadcast', { event: 'ice-candidate' }, async (payload) => {
      if (payload.payload.fromUserId !== currentUserId && peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(payload.payload.candidate);
      }
    });

    channel.on('broadcast', { event: 'call-end' }, (payload) => {
      if (payload.payload.toUserId === currentUserId) {
        endCall();
        toast({
          title: "Call Ended",
          description: `${participantName} ended the call`
        });
      }
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, conversationId, currentUserId, participantName]);

  // Start call
  const startCall = async () => {
    try {
      setCallState(prev => ({ ...prev, isConnecting: true }));
      
      const peerConnection = await initializeWebRTC();
      
      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send offer through Supabase
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'call-offer',
          payload: {
            offer,
            fromUserId: currentUserId,
            toUserId: otherUserId,
            conversationId
          }
        });
      }

      toast({
        title: "Calling...",
        description: `Calling ${participantName}`
      });
    } catch (error) {
      setCallState(prev => ({ ...prev, isConnecting: false }));
    }
  };

  // Answer call
  const answerCall = async (offer: RTCSessionDescriptionInit) => {
    try {
      const peerConnection = await initializeWebRTC();
      
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer through Supabase
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'call-answer',
          payload: {
            answer,
            fromUserId: currentUserId,
            toUserId: otherUserId,
            conversationId
          }
        });
      }

      setCallState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        isConnected: true, 
        isIncoming: false 
      }));
    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  // End call
  const endCall = () => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Notify other user
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'call-end',
        payload: {
          fromUserId: currentUserId,
          toUserId: otherUserId,
          conversationId
        }
      });
    }

    setCallState({
      isConnected: false,
      isConnecting: false,
      isIncoming: false,
      micEnabled: true,
      videoEnabled: true,
      speakerEnabled: true
    });

    onClose();
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !callState.micEnabled;
        setCallState(prev => ({ ...prev, micEnabled: !prev.micEnabled }));
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !callState.videoEnabled;
        setCallState(prev => ({ ...prev, videoEnabled: !prev.videoEnabled }));
      }
    }
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    setCallState(prev => ({ ...prev, speakerEnabled: !prev.speakerEnabled }));
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = callState.speakerEnabled;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl h-full max-h-[90vh] bg-black text-white border-gray-800">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gray-900 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{participantName}</h3>
              <p className="text-sm text-gray-400">
                {callState.isConnecting && 'Connecting...'}
                {callState.isConnected && 'Connected'}
                {callState.isIncoming && 'Incoming call...'}
                {!callState.isConnecting && !callState.isConnected && !callState.isIncoming && 'Ready to call'}
              </p>
            </div>
          </div>

          {/* Video area */}
          <div className="flex-1 relative bg-gray-900">
            {/* Remote video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local video - picture in picture */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Call controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              {/* Microphone */}
              <Button
                variant={callState.micEnabled ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleMic}
              >
                {callState.micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              {/* Video */}
              <Button
                variant={callState.videoEnabled ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleVideo}
              >
                {callState.videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>

              {/* End call */}
              <Button
                variant="destructive"
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={endCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>

              {/* Speaker */}
              <Button
                variant={callState.speakerEnabled ? "default" : "secondary"}
                size="lg"
                className="rounded-full w-12 h-12"
                onClick={toggleSpeaker}
              >
                {callState.speakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>

              {/* Start call button (only show when not connected/connecting) */}
              {!callState.isConnected && !callState.isConnecting && !callState.isIncoming && (
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-full w-12 h-12 bg-green-600 hover:bg-green-700"
                  onClick={startCall}
                >
                  <Phone className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebRTCCall;