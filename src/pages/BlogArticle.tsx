import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import aiFarmingImage from '@/assets/ai-farming.jpg';
import saltResistantImage from '@/assets/salt-resistant-farming.jpg';
import farmingHealthImage from '@/assets/farming-health.jpg';
import waterManagementImage from '@/assets/water-management.jpg';

const BlogArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  // This would normally come from an API or blog data service
  const articleData = {
    1: {
      id: 1,
      title: 'AI-Powered Crop Recommendations for Sri Lankan Farmers',
      excerpt: 'Revolutionary AI technology helps farmers increase yields by 30% through smart crop selection and timing recommendations.',
      category: 'AI & Technology',
      author: 'Dr. Priya Kumari',
      date: '2024-03-15',
      readTime: 5,
      tags: ['AI', 'Technology', 'Crops', 'Innovation'],
      image: aiFarmingImage,
      content: `Artificial Intelligence is transforming agriculture in Sri Lanka, offering farmers unprecedented insights into crop management and yield optimization. Recent studies show that AI-powered recommendations can increase crop yields by up to 30% while reducing resource consumption.

## The Technology Behind the Revolution

The AI systems being deployed across Sri Lankan farms utilize machine learning algorithms trained on decades of agricultural data. These systems analyze multiple variables including:

- **Weather patterns and seasonal predictions**
- **Soil composition and nutrient levels**
- **Historical crop performance data**
- **Market price trends and demand forecasting**
- **Pest and disease occurrence patterns**

## Real-World Applications

### Smart Planting Schedules
The AI analyzes weather predictions and soil conditions to recommend optimal planting times. Farmers using these systems report 25-40% improvements in germination rates and overall crop health.

### Precision Resource Management
By analyzing soil sensors and weather data, the AI provides specific recommendations for irrigation, fertilization, and pest control timing. This has led to:
- 35% reduction in water usage
- 28% decrease in fertilizer costs
- 45% improvement in pest management effectiveness

### Market-Driven Crop Selection
The system considers local and export market demands, helping farmers choose crops that will be profitable when harvest time arrives.

## Success Stories from the Field

**Farmer Sunil from Anuradhapura** saw his tomato yields increase from 15 tons per hectare to 22 tons per hectare after following AI recommendations for planting timing and resource management.

**Kumari from Polonnaruwa** reduced her water consumption by 40% while maintaining crop quality by following AI irrigation schedules based on soil moisture sensors and weather predictions.

## Government Support and Accessibility

The Sri Lankan government has initiated several programs to make AI technology accessible to small-scale farmers:

1. **Subsidized sensor programs** - Providing soil moisture and weather monitoring equipment at reduced costs
2. **Mobile app development** - User-friendly interfaces in Sinhala and Tamil languages
3. **Training workshops** - Regular sessions to help farmers understand and implement AI recommendations
4. **Cooperative partnerships** - Sharing technology costs among farmer groups

## Challenges and Solutions

### Technology Adoption Barriers
- **Digital literacy**: Ongoing training programs address basic smartphone and app usage
- **Initial costs**: Government subsidies and cooperative purchasing reduce individual farmer investment
- **Connectivity issues**: Offline functionality development for areas with poor internet coverage

### Data Privacy and Security
Farmers' data is protected through:
- Local data storage options
- Anonymized aggregation for research purposes
- Transparent data usage policies
- Farmer consent for all data sharing

## The Road Ahead

The next phase of AI agriculture in Sri Lanka includes:

- **Drone integration** for aerial crop monitoring
- **Satellite imagery analysis** for large-scale pattern recognition
- **Blockchain integration** for supply chain transparency
- **Climate change adaptation** models for long-term planning

## Economic Impact

Early adopters of AI farming technology report:
- **Average income increase**: 35-50%
- **Reduced operational costs**: 20-30%
- **Improved crop quality**: Leading to premium market prices
- **Reduced crop losses**: 40% decrease in weather and pest-related losses

## Conclusion

AI-powered agriculture represents a significant opportunity for Sri Lankan farmers to improve productivity, reduce environmental impact, and increase profitability. As technology becomes more accessible and government support continues, we can expect to see wider adoption and even greater benefits for farming communities across the island.

The transformation is already underway, with early results showing tremendous promise. For farmers willing to embrace these new tools, the future of agriculture in Sri Lanka looks brighter than ever.

---

*Dr. Priya Kumari is an Agricultural Technology Specialist at the University of Peradeniya and leads the National AI Agriculture Initiative.*`
    },
    2: {
      id: 2,
      title: 'Salt-Resistant Farming: Reclaiming Sri Lankan Coastal Agriculture',
      excerpt: 'Special Task Force develops innovative methods to restore salt-poisoned farmlands along Sri Lankan coastline.',
      category: 'Climate Adaptation',
      author: 'Sameera Dilshan',
      date: '2024-05-20',
      readTime: 8,
      tags: ['Climate Change', 'Salinity', 'Coastal Agriculture', 'Innovation'],
      image: saltResistantImage,
      content: `Two hours' drive south of Colombo lies Katukurunda, where an extraordinary agricultural experiment is taking place. What was once barren, salt-poisoned land is now producing healthy pumpkins, bitter gourds, and other vegetables thanks to an innovative pilot project led by the Special Task Force.

## The Challenge: Rising Salinity

Increasing salinity has become one of the most serious threats to Sri Lankan agriculture, particularly along the coastline. Traditional rice paddies that have fed families for generations are being slowly swallowed by salt infiltration, a problem accelerating due to climate change.

### The Scale of the Problem
- **Affected area**: Over 30,000 hectares of coastal agricultural land
- **Farmer impact**: More than 15,000 farming families directly affected
- **Economic loss**: Estimated at Rs. 2.5 billion annually in crop losses
- **Sea level rise**: Contributing 2-3mm annually to saltwater intrusion

## The Katukurunda Model Farm

Led by Special Task Force commando Sameera Dilshan, the model farm at Katukurunda demonstrates that with the right techniques, salt-affected land can be restored to productive use.

### Key Innovations

#### 1. Salt-Tolerant Crop Varieties
The project focuses on crops that can thrive in saline conditions:
- **Pumpkins**: Show remarkable salt tolerance while maintaining nutritional value
- **Bitter gourds**: Adapt well to brackish water irrigation
- **Certain tomato varieties**: Bred specifically for salt resistance
- **Halophytic vegetables**: Plants that naturally accumulate salt without damage

#### 2. Advanced Drainage Systems
- **Underground drainage networks** remove excess salt from root zones
- **Raised bed cultivation** prevents waterlogging and salt accumulation
- **Strategic water management** using freshwater when available, brackish water when necessary

#### 3. Soil Rehabilitation Techniques
- **Organic matter addition**: Compost and green manures improve soil structure
- **Gypsum application**: Helps displace sodium from soil particles
- **Biochar integration**: Improves water retention and nutrient availability
- **Beneficial microorganism introduction**: Soil bacteria that help plants cope with salt stress

## Scientific Approach

### Soil Testing and Monitoring
Regular testing tracks:
- **Electrical conductivity (EC)**: Measuring salt concentration levels
- **Sodium adsorption ratio (SAR)**: Assessing soil structure damage
- **pH levels**: Monitoring alkalinity changes
- **Nutrient availability**: Ensuring plants get essential minerals

### Plant Performance Metrics
- **Yield comparison**: Salt-resistant varieties vs. traditional crops
- **Nutritional analysis**: Ensuring food quality isn't compromised
- **Growth patterns**: Tracking plant development under stress conditions
- **Water use efficiency**: Optimizing irrigation in saline conditions

## Community Impact and Adoption

### Farmer Training Programs
The project includes comprehensive education:
- **Hands-on workshops** at the model farm
- **Demonstration plots** in affected communities
- **Peer-to-peer learning** networks among farmers
- **Technical support** for implementation

### Economic Viability
Early results show promising returns:
- **Production costs**: 15-20% higher initially due to specialized inputs
- **Yield recovery**: 60-80% of pre-salinity levels achieved
- **Market premium**: Some salt-tolerant crops command higher prices
- **Risk reduction**: Diversified crops reduce total farm vulnerability

## Scaling the Solution

### Government Support
The success at Katukurunda has attracted policy attention:
- **Budget allocation**: Rs. 500 million earmarked for salinity management
- **Research partnerships**: Universities collaborating on variety development
- **Extension services**: Training agricultural officers in new techniques
- **Subsidized inputs**: Reduced costs for salt-resistant seeds and amendments

### Regional Adaptation
Different coastal areas require tailored approaches:
- **Northern Province**: Focus on drought-salt tolerance combinations
- **Southern Coast**: Tsunami recovery integrated with salinity management
- **Eastern Province**: Post-conflict agricultural rehabilitation
- **Western Province**: Urban agriculture salt management

## Technological Integration

### Precision Agriculture Tools
- **Soil sensors**: Real-time monitoring of salt levels and moisture
- **Weather stations**: Tracking rainfall and evaporation rates
- **Drone surveys**: Mapping salt-affected areas for targeted intervention
- **Mobile apps**: Farmer-friendly interfaces for monitoring and advice

### Research and Development
Ongoing research focuses on:
- **Genetic improvement**: Breeding programs for enhanced salt tolerance
- **Biofertilizer development**: Microorganisms that help plants cope with salt
- **Water treatment**: Affordable desalination for small-scale irrigation
- **Integrated systems**: Combining aquaculture with salt-tolerant agriculture

## Environmental Benefits

### Ecosystem Restoration
The project contributes to:
- **Soil health improvement**: Reducing erosion and improving structure
- **Biodiversity enhancement**: Creating habitat for salt-tolerant plants and animals
- **Carbon sequestration**: Organic matter addition stores atmospheric carbon
- **Water quality protection**: Preventing further saltwater intrusion

## Challenges and Solutions

### Technical Challenges
- **High initial costs**: Offset by government subsidies and cooperative purchasing
- **Knowledge gaps**: Addressed through continuous training and support
- **Market access**: Developing supply chains for new crop varieties
- **Quality control**: Ensuring consistent production standards

### Social and Cultural Barriers
- **Traditional farming attachment**: Respecting cultural connections to rice cultivation
- **Risk aversion**: Demonstration plots reduce farmer hesitation
- **Gender inclusion**: Ensuring women farmers have equal access to training
- **Youth engagement**: Attracting young people to modernized agriculture

## Future Prospects

### Expansion Plans
The success at Katukurunda is being replicated:
- **50 additional sites** identified for pilot programs
- **Regional adaptation** studies for different coastal conditions
- **International collaboration** with salt-affected countries
- **Technology transfer** to other climate-vulnerable regions

### Research Priorities
Next-phase research includes:
- **Climate-smart varieties**: Crops adapted to multiple stress factors
- **Precision management**: AI-driven optimization of saline agriculture
- **Value chain development**: Processing and marketing salt-tolerant crops
- **Policy framework**: Regulatory support for innovative farming practices

## Conclusion

The Katukurunda model farm demonstrates that with innovation, determination, and scientific approach, even the most challenging agricultural problems can be solved. Commando Sameera Dilshan's unique mission - reclaiming salt-poisoned farms - offers hope to thousands of coastal farmers facing similar challenges.

As climate change accelerates saltwater intrusion, the techniques developed at Katukurunda become increasingly valuable not just for Sri Lanka, but for coastal agricultural communities worldwide. The project proves that with the right support and approach, farmers can adapt and thrive even in the face of environmental challenges.

The transformation of barren, salt-affected land into productive agricultural plots serves as a powerful symbol of resilience and innovation in Sri Lankan agriculture. It shows that with proper planning, scientific backing, and community engagement, we can turn climate challenges into opportunities for sustainable development.

---

*Sameera Dilshan is a Special Task Force commando leading the agricultural rehabilitation project at Katukurunda. This article is based on field observations and project data from the pilot program.*`
    },
    3: {
      id: 3,
      title: 'Kidney Disease Crisis in Sri Lankan Farming Communities',
      excerpt: 'Investigating the mysterious rise of chronic kidney disease among farmers in North Central Province.',
      category: 'Health & Safety',
      author: 'Dr. Kang-Chun Cheng',
      date: '2024-04-28',
      readTime: 12,
      tags: ['Health', 'CKD', 'Farming', 'Public Health'],
      image: farmingHealthImage,
      content: `In the sleepy, verdant village of Ambagaswewa, in the Polonnaruwa district of Sri Lanka's North Central province, a silent health crisis is unfolding that has puzzled medical experts for over two decades. Here, chronic kidney disease of unknown etiology (CKDu) has become an epidemic, affecting thousands of farming families and challenging everything we thought we knew about kidney health.

## A Disease Without Obvious Cause

### The Mysterious Pattern
Unlike typical chronic kidney disease linked to diabetes or hypertension, CKDu in Sri Lanka presents a different profile:
- **Primary victims**: Male agricultural workers aged 30-60
- **Geographic concentration**: North Central and Uva provinces
- **Seasonal variation**: Symptoms often worsen during farming seasons
- **Family clustering**: Multiple family members sometimes affected
- **No traditional risk factors**: Many patients have normal blood pressure and glucose levels

### The Human Cost
The numbers tell a devastating story:
- **Estimated cases**: Over 400,000 people affected nationwide
- **Annual deaths**: Approximately 20,000 related fatalities
- **Economic impact**: Families losing primary breadwinners
- **Healthcare burden**: Overwhelming rural medical facilities
- **Social disruption**: Children leaving school to support families

## Life in the Shadow of Disease

### TMH Gamini Sunil Thennakoon's Story
At 63, Gamini represents thousands of farmers grappling with this mysterious illness. Once a robust agricultural worker, he now faces daily challenges:
- **Physical limitations**: Chronic fatigue affects his ability to work
- **Financial burden**: Medical costs drain family resources
- **Uncertainty**: Not knowing what caused his condition or how to prevent its progression
- **Family fear**: Concerns about children and grandchildren developing the disease

### Community Impact
The disease has transformed entire villages:
- **Abandoned fields**: Sick farmers unable to maintain crops
- **Economic decline**: Reduced agricultural productivity
- **Migration patterns**: Families moving away from affected areas
- **Social stigma**: Discrimination against affected families
- **Cultural disruption**: Traditional farming practices questioned

## Scientific Investigation

### Proposed Causes Under Study

#### 1. Environmental Toxins
**Heavy metals**: Cadmium, arsenic, and lead found in water sources and soil
- Sources: Industrial pollution, pesticides, fertilizers
- Exposure route: Contaminated drinking water and food crops
- Research status: Elevated levels found in affected areas

**Pesticide exposure**: Organophosphates and other agricultural chemicals
- Usage patterns: Intensive application in affected regions
- Health effects: Potential kidney damage from chronic exposure
- Protective measures: Limited use of safety equipment among farmers

#### 2. Water Quality Issues
**Fluoride contamination**: High levels in groundwater
- Natural occurrence: Geological formations releasing fluoride
- Health impact: Skeletal and dental fluorosis, potential kidney damage
- Geographic correlation: Matches disease distribution patterns

**Hardness and minerals**: Calcium and magnesium imbalances
- Water sources: Deep wells in affected areas
- Processing: Limited water treatment in rural areas
- Health implications: Potential strain on kidney function

#### 3. Heat Stress and Dehydration
**Occupational exposure**: Prolonged work in high temperatures
- Climate factors: Increasing temperatures due to climate change
- Work patterns: Long hours in direct sunlight
- Hydration practices: Often inadequate water intake during work

**Chronic dehydration**: Repeated episodes of fluid loss
- Physiological stress: Kidney strain from concentration needs
- Electrolyte imbalance: Sodium and potassium disruption
- Cumulative effect: Years of exposure leading to kidney damage

#### 4. Infectious Agents
**Bacterial toxins**: Potential role of environmental bacteria
- Research findings: Some studies suggest bacterial involvement
- Transmission routes: Contaminated water and soil contact
- Geographic patterns: Matches waterborne disease distribution

#### 5. Genetic Predisposition
**Population susceptibility**: Genetic factors making certain groups vulnerable
- Family clustering: Multiple affected family members
- Ethnic patterns: Specific community groups more affected
- Gene-environment interaction: Genetic susceptibility triggered by environmental factors

## Public Health Response

### Government Initiatives

#### 1. National Kidney Disease Prevention Program
**Objectives**:
- Early detection and screening
- Risk factor identification and mitigation
- Treatment accessibility improvement
- Research coordination and funding

**Components**:
- Mobile screening units visiting rural areas
- Community health worker training
- Subsidized dialysis programs
- Kidney transplant facility development

#### 2. Water Quality Improvement Projects
**Safe drinking water provision**:
- Reverse osmosis plants in affected areas
- Rainwater harvesting promotion
- Water quality monitoring systems
- Community education on water safety

**Agricultural water management**:
- Irrigation system improvements
- Alternative water source development
- Water treatment at community level
- Farmer education on water usage

#### 3. Agricultural Practice Reforms
**Pesticide regulation**:
- Banned substance lists expansion
- Safer alternative promotion
- Application training programs
- Protective equipment subsidies

**Organic farming promotion**:
- Training in organic methods
- Market linkage for organic products
- Certification program development
- Financial incentives for conversion

### International Collaboration

#### Research Partnerships
**Academic institutions**:
- University collaborations for research
- Student exchange programs
- Joint research funding
- Publication and knowledge sharing

**WHO and UN involvement**:
- Technical assistance provision
- Funding for research and intervention
- Policy guidance and recommendations
- International experience sharing

#### Technology Transfer
**Diagnostic equipment**:
- Advanced testing facility establishment
- Training on modern diagnostic methods
- Equipment maintenance and calibration
- Quality assurance programs

**Treatment technologies**:
- Dialysis equipment and supplies
- Transplant facility development
- Telemedicine for remote areas
- Mobile health technologies

## Prevention and Mitigation Strategies

### Individual Level Interventions

#### 1. Health Monitoring
**Regular screening**:
- Annual kidney function tests
- Blood pressure monitoring
- Diabetes screening
- Early symptom recognition

**Lifestyle modifications**:
- Adequate hydration maintenance
- Heat exposure reduction
- Regular medical check-ups
- Stress management techniques

#### 2. Occupational Safety
**Protective equipment use**:
- Masks and gloves during pesticide application
- Protective clothing in high-heat conditions
- Eye protection from chemical exposure
- Proper equipment maintenance

**Work practice modifications**:
- Rest periods during hot weather
- Shade provision in fields
- Hydration schedule implementation
- Chemical handling training

### Community Level Interventions

#### 1. Water Security
**Community water systems**:
- Shared reverse osmosis plants
- Community well testing programs
- Water storage and distribution systems
- Maintenance training for local technicians

**Household water treatment**:
- Simple filtration system distribution
- Water testing kit availability
- Boiling and purification education
- Storage and handling best practices

#### 2. Agricultural Transformation
**Integrated pest management**:
- Biological control method training
- Crop rotation and diversity promotion
- Natural pesticide alternatives
- Ecosystem-based agriculture

**Climate-smart practices**:
- Drought-resistant crop varieties
- Efficient irrigation techniques
- Soil conservation methods
- Sustainable intensification

## Economic and Social Support

### Healthcare Access
**Treatment affordability**:
- Government-subsidized dialysis
- Free screening programs
- Medicine provision programs
- Transportation support for treatment

**Infrastructure development**:
- Rural clinic establishment
- Specialist doctor deployment
- Equipment and supply chains
- Emergency care protocols

### Livelihood Support
**Alternative income generation**:
- Non-agricultural skill training
- Microfinance for small businesses
- Cooperative development support
- Value-added agriculture promotion

**Social protection**:
- Disability benefits for affected farmers
- Family support programs
- Education scholarships for children
- Community support networks

## Research and Innovation

### Ongoing Studies

#### 1. Epidemiological Research
**Disease mapping**:
- Geographic information system usage
- Risk factor spatial analysis
- Temporal trend identification
- Population screening studies

**Exposure assessment**:
- Environmental monitoring programs
- Biomarker development and testing
- Dose-response relationship studies
- Multi-generational effect analysis

#### 2. Treatment Innovation
**Dialysis alternatives**:
- Peritoneal dialysis promotion
- Home-based treatment options
- Cost-effective technology development
- Training program expansion

**Preventive medicine**:
- Early intervention strategies
- Nutritional supplement research
- Exercise and lifestyle programs
- Traditional medicine integration

### Future Research Priorities

#### 1. Causation Studies
**Multi-factor analysis**:
- Complex interaction research
- Longitudinal cohort studies
- Biomarker validation
- Genetic susceptibility mapping

#### 2. Intervention Evaluation
**Program effectiveness**:
- Prevention strategy assessment
- Treatment outcome evaluation
- Cost-benefit analysis
- Quality of life measurements

## Global Implications

### Similar Patterns Worldwide
The Sri Lankan CKDu crisis isn't isolated:
- **Mesoamerica**: Similar kidney disease patterns in agricultural workers
- **India**: Comparable cases in farming communities
- **Egypt**: Agricultural worker kidney disease reports
- **Australia**: Aboriginal community kidney disease concerns

### Lessons for Global Health
**Climate change implications**:
- Heat stress and kidney disease connections
- Water security and health relationships
- Agricultural adaptation needs
- Public health system strengthening requirements

**Occupational health insights**:
- Agricultural worker protection needs
- Chemical exposure monitoring importance
- Heat stress prevention strategies
- Rural healthcare delivery challenges

## The Path Forward

### Immediate Priorities
1. **Enhanced surveillance**: Better disease tracking and reporting
2. **Water security**: Safe drinking water for all affected communities
3. **Healthcare access**: Improved treatment availability and affordability
4. **Research intensification**: Increased funding for causation studies
5. **Prevention focus**: Proactive measures rather than reactive treatment

### Long-term Vision
**Sustainable agriculture**:
- Environmentally friendly farming practices
- Economic viability for farmers
- Health protection integration
- Climate resilience building

**Healthy communities**:
- Disease-free rural populations
- Economic prosperity in agricultural areas
- Strong healthcare systems
- Environmental protection

## Conclusion

The chronic kidney disease crisis in Sri Lankan farming communities represents one of the most complex public health challenges of our time. While the exact causes remain under investigation, the urgency of response is clear. The suffering of farmers like TMH Gamini Sunil Thennakoon and thousands of others demands immediate action on multiple fronts.

Success in addressing this crisis requires:
- **Scientific rigor** in understanding causation
- **Community engagement** in prevention and treatment
- **Policy coordination** across health, agriculture, and environment sectors
- **International collaboration** for resources and expertise
- **Long-term commitment** to sustainable solutions

The stakes couldn't be higher. These farming communities form the backbone of Sri Lanka's agricultural sector and rural economy. Their health and well-being directly impact food security, economic stability, and social cohesion across the island.

As research continues and interventions expand, there's hope that this mysterious disease can be conquered. But time is of the essence. Every day of delay means more families affected, more livelihoods lost, and more communities struggling with an enemy they can't see or fully understand.

The fight against CKDu in Sri Lanka is not just a medical battle—it's a test of our commitment to environmental justice, occupational health, and the basic right of farming communities to live and work without fear of disease. The outcome will shape not only the future of agriculture in Sri Lanka but also serve as a model for addressing similar challenges emerging in agricultural communities worldwide.

---

*Dr. Kang-Chun Cheng is an investigative health journalist who has extensively covered the CKDu crisis in Sri Lanka. This article is based on field research and interviews with affected communities in Polonnaruwa district.*`
    },
    4: {
      id: 4,
      title: 'Budget 2025: Addressing Sri Lanka\'s Agricultural Investment Gap',
      excerpt: 'Agricultural spending has dropped from 6.4% to 2% of government budget. Will 2025 reverse this trend?',
      category: 'Policy & Economics',
      author: 'Dr. Manoj Thibbotuwawa',
      date: '2024-11-15',
      readTime: 10,
      tags: ['Budget', 'Policy', 'Investment', 'Economics'],
      image: waterManagementImage,
      content: `As Sri Lanka prepares for Budget 2025, the agricultural sector stands at a critical crossroads. Public expenditure on agriculture has plummeted from 6.4% to just 2% of total government spending between 2014 and 2023, raising serious questions about the country's commitment to food security and rural development. This dramatic decline in investment comes at a time when the sector faces unprecedented challenges from climate change, market volatility, and post-pandemic recovery needs.

## The Declining Investment Trajectory

### A Decade of Disinvestment
The statistics paint a concerning picture:
- **2014**: Agricultural spending represented 6.4% of government budget
- **2019**: Declined to 4.2% amid fiscal pressures
- **2021**: Further reduced to 3.1% during economic crisis
- **2023**: Reached historic low of 2.0%
- **Trend analysis**: Average annual decline of 4.8% in real terms

### Current Spending Allocation
The limited agricultural budget is distributed as follows:
- **Irrigation subsector**: 41% of total agricultural spending
- **Subsidies**: 26% (primarily fertilizer and seed subsidies)
- **Research and development**: 8%
- **Extension services**: 12%
- **Infrastructure**: 9%
- **Administrative costs**: 4%

### Regional and Sectoral Disparities
Investment distribution shows significant imbalances:
- **Major irrigation schemes**: Receive 65% of irrigation funding
- **Small-scale farmers**: Less than 20% of targeted support
- **Northern and Eastern provinces**: Historically underfunded
- **Export crops**: Disproportionately supported over food crops
- **Women farmers**: Minimal specific allocations

## Economic Context and Constraints

### Fiscal Pressures
Sri Lanka's challenging economic situation has forced difficult budget choices:
- **Debt servicing**: Consuming 70%+ of government revenue
- **IMF program requirements**: Fiscal consolidation mandates
- **Revenue shortfalls**: Tax collection below targets
- **Priority competition**: Health, education, and infrastructure needs
- **Economic recovery**: Focus on immediate stabilization

### International Comparisons
Sri Lanka's agricultural investment lags regional peers:
- **Thailand**: 4.8% of government spending on agriculture
- **Vietnam**: 6.2% agricultural budget allocation
- **Bangladesh**: 3.9% despite resource constraints
- **India**: 5.5% including state government contributions
- **Regional average**: 4.7% for developing Asian economies

## Sector Performance and Challenges

### Agricultural Productivity Trends
Limited investment has impacted sector performance:
- **GDP contribution**: Declined from 8.2% to 7.1% (2019-2023)
- **Productivity growth**: Lagging at 1.2% annually
- **Export earnings**: Reduced competitiveness in global markets
- **Food security**: Increased import dependency
- **Rural poverty**: Persistent despite overall economic progress

### Climate Change Impacts
Investment shortfalls hamper climate adaptation:
- **Weather resilience**: Limited crop diversification support
- **Water management**: Aging irrigation infrastructure
- **Early warning systems**: Inadequate coverage
- **Disaster preparedness**: Minimal farmer protection schemes
- **Technology adoption**: Slow uptake of climate-smart practices

### Market Access and Value Addition
Underfunding affects market development:
- **Post-harvest facilities**: Significant storage and processing gaps
- **Transport infrastructure**: Rural road network deterioration
- **Market information**: Limited price and demand intelligence
- **Value chains**: Weak linkages between farmers and consumers
- **Quality standards**: Inadequate certification and testing facilities

## International Best Practices

### Successful Investment Models

#### 1. Vietnam's Agricultural Transformation
Vietnam's sustained investment strategy offers valuable lessons:
- **Consistent funding**: Maintained 6%+ budget allocation for two decades
- **Technology focus**: Heavy investment in research and extension
- **Market orientation**: Export promotion and value chain development
- **Small farmer support**: Comprehensive rural credit and insurance programs
- **Results**: Transformed from food importer to major exporter

#### 2. Thailand's Integrated Approach
Thailand's comprehensive agricultural policy demonstrates effective coordination:
- **Multi-sectoral planning**: Agriculture, industry, and service integration
- **Innovation emphasis**: Strong university-industry linkages
- **Regional development**: Balanced support across geographic areas
- **Sustainability focus**: Environmental protection with productivity growth
- **Outcomes**: Diversified, high-value agricultural economy

#### 3. Ethiopia's Recent Progress
Despite resource constraints, Ethiopia shows targeted investment impact:
- **Extension revolution**: Massive expansion of agricultural advisory services
- **Smallholder focus**: Programs specifically designed for small-scale farmers
- **Regional adaptation**: Context-specific interventions
- **Measurable results**: Significant productivity and income improvements

### Key Success Factors
Analysis reveals critical elements for effective agricultural investment:
1. **Political commitment**: Sustained support across electoral cycles
2. **Integrated planning**: Coordination across ministries and agencies
3. **Evidence-based targeting**: Investments guided by rigorous analysis
4. **Stakeholder engagement**: Farmer and private sector participation
5. **Performance monitoring**: Regular evaluation and adaptation

## Budget 2025: Critical Decision Points

### Investment Priorities for Transformation

#### 1. Climate-Resilient Infrastructure
**Irrigation modernization** (Recommended allocation: Rs. 45 billion)
- Smart irrigation system installation
- Water storage capacity expansion
- Drainage and flood management
- Solar-powered pumping systems
- Community-managed water schemes

**Research and development** (Recommended allocation: Rs. 15 billion)
- Drought and flood-resistant variety development
- Precision agriculture technology
- Soil health monitoring and improvement
- Integrated pest management systems
- Climate forecasting and early warning

#### 2. Market Development and Value Addition
**Post-harvest infrastructure** (Recommended allocation: Rs. 25 billion)
- Cold storage and processing facilities
- Rural market center development
- Transportation and logistics improvement
- Quality testing and certification systems
- Digital marketing platform development

**Financial inclusion** (Recommended allocation: Rs. 20 billion)
- Agricultural credit expansion
- Crop insurance scheme strengthening
- Rural banking network enhancement
- Digital payment system promotion
- Cooperative society modernization

#### 3. Human Capital Development
**Extension and training** (Recommended allocation: Rs. 12 billion)
- Agricultural officer deployment and training
- Farmer field school expansion
- Youth in agriculture programs
- Women farmer empowerment initiatives
- Digital literacy and technology adoption

**Education and skills** (Recommended allocation: Rs. 8 billion)
- Agricultural education curriculum updates
- Vocational training program enhancement
- University research facility improvement
- International exchange and collaboration
- Innovation incubator establishment

### Financing Strategy

#### 1. Domestic Resource Mobilization
**Revenue enhancement measures**:
- Agricultural income tax system optimization
- Land-based revenue stream development
- User fee systems for government services
- Public-private partnership promotion
- Efficiency improvements in spending

**Budget reallocation**:
- Subsidy rationalization and targeting
- Administrative cost reduction
- Overlap elimination between agencies
- Performance-based budget allocation
- Multi-year funding commitments

#### 2. International Financing
**Development partner engagement**:
- World Bank agricultural investment projects
- Asian Development Bank infrastructure funding
- Bilateral cooperation agreements
- Climate finance access
- Technical assistance programs

**Private sector involvement**:
- Contract farming promotion
- Agribusiness investment incentives
- Technology transfer partnerships
- Value chain development collaboration
- Risk-sharing mechanism creation

### Implementation Framework

#### 1. Institutional Strengthening
**Coordination mechanisms**:
- Inter-ministerial committee establishment
- Provincial-central government alignment
- Private sector dialogue platforms
- Civil society engagement processes
- International partner coordination

**Capacity building**:
- Public sector skill development
- Project management system strengthening
- Monitoring and evaluation enhancement
- Financial management improvement
- Transparency and accountability measures

#### 2. Performance Monitoring
**Key performance indicators**:
- Agricultural productivity growth rates
- Farmer income improvement measures
- Food security indicators
- Export performance metrics
- Environmental sustainability measures

**Regular review processes**:
- Quarterly progress assessments
- Annual performance evaluations
- Mid-term program reviews
- Stakeholder feedback sessions
- Policy adjustment mechanisms

## Economic Impact Projections

### Short-term Benefits (1-3 years)
Increased agricultural investment could yield:
- **Employment creation**: 150,000 direct and indirect jobs
- **Income improvement**: 25-30% increase for participating farmers
- **Food security**: Reduced import dependency by 15%
- **Regional development**: Balanced growth across provinces
- **Foreign exchange**: Reduced agricultural trade deficit

### Medium-term Transformation (3-7 years)
Sustained investment would enable:
- **Productivity revolution**: 50% increase in yields for key crops
- **Export competitiveness**: Doubling of agricultural export earnings
- **Rural prosperity**: Significant poverty reduction in farming communities
- **Environmental protection**: Sustainable intensification achievement
- **Climate resilience**: Adaptation to changing weather patterns

### Long-term Vision (7-15 years)
Comprehensive transformation could achieve:
- **High-value agriculture**: Transition to premium product focus
- **Innovation ecosystem**: Strong research-industry linkages
- **Regional leadership**: Becoming South Asian agricultural hub
- **Food system transformation**: Modern, efficient supply chains
- **Sustainable development**: Environmental and social objectives balance

## Risk Factors and Mitigation

### Implementation Challenges
**Capacity constraints**:
- Limited technical expertise in government
- Weak project management systems
- Insufficient monitoring capabilities
- Poor inter-agency coordination
- Limited stakeholder engagement

**Mitigation strategies**:
- Technical assistance and training programs
- System strengthening initiatives
- Performance-based management
- Regular review and adjustment
- Stakeholder capacity building

### External Risks
**Economic uncertainties**:
- Global market volatility
- Climate change impacts
- Political instability risks
- International funding availability
- Technology access limitations

**Risk management approaches**:
- Diversified funding sources
- Flexible implementation strategies
- Strong international partnerships
- Technology transfer agreements
- Political consensus building

## Policy Recommendations

### Immediate Actions (Budget 2025)
1. **Double agricultural budget allocation** to 4% of government spending
2. **Establish agricultural transformation fund** with multi-year commitments
3. **Create performance-based allocation system** with clear targets
4. **Strengthen institutional coordination** mechanisms
5. **Launch signature programs** in climate resilience and market development

### Medium-term Reforms (2025-2030)
1. **Develop comprehensive agricultural policy** with 10-year vision
2. **Establish agricultural development bank** for specialized financing
3. **Create innovation ecosystem** linking research and industry
4. **Implement regional development strategy** for balanced growth
5. **Strengthen international cooperation** and technology transfer

### Long-term Vision (2030-2040)
1. **Transform Sri Lanka into regional agricultural hub**
2. **Achieve climate-neutral agricultural growth**
3. **Ensure food security for all citizens**
4. **Create prosperous rural economies**
5. **Establish global competitiveness in high-value products**

## Conclusion

Budget 2025 represents a watershed moment for Sri Lankan agriculture. The dramatic decline in agricultural investment over the past decade has created a critical situation that demands immediate and decisive action. While fiscal constraints are real, the cost of continued under-investment far exceeds the resources required for transformation.

The evidence from successful countries demonstrates that sustained agricultural investment pays dividends in economic growth, poverty reduction, food security, and environmental sustainability. Sri Lanka has the knowledge, experience, and potential to achieve similar transformation, but only with adequate investment and political commitment.

**Key imperatives for Budget 2025**:
- **Reverse the declining investment trend** with substantial budget increases
- **Focus on productivity and climate resilience** as primary objectives
- **Ensure inclusive growth** that benefits all farmers, especially smallholders
- **Build strong institutions** capable of effective program implementation
- **Create sustainable financing** mechanisms for long-term transformation

The agricultural sector employs over 25% of Sri Lanka's workforce and remains the backbone of rural economies. Continued neglect risks food security, rural poverty persistence, and missed opportunities for economic growth. Budget 2025 must signal a renewed commitment to agricultural transformation as a cornerstone of national development strategy.

The choice is clear: invest adequately in agriculture now, or face escalating costs of food insecurity, rural poverty, and economic stagnation in the future. For the sake of millions of farming families and the nation's long-term prosperity, Budget 2025 must prioritize agricultural transformation with the urgency and resources it deserves.

---

*Dr. Manoj Thibbotuwawa is an Agricultural Economist and Policy Analyst. Dr. Lakmini Fernando is a Rural Development Specialist. Both are affiliated with the Institute of Policy Studies of Sri Lanka.*`
    },
    5: {
      id: 5,
      title: 'Below-Average Paddy Output: Climate and Pest Challenges in 2024',
      excerpt: 'FAO reports below-average 2024 main paddy output due to localized floods, pests and diseases affecting Sri Lankan farmers.',
      category: 'Production Analysis',
      author: 'FAO Sri Lanka',
      date: '2024-06-24',
      readTime: 7,
      tags: ['Paddy', 'Climate', 'Pests', 'Production'],
      content: `The Food and Agriculture Organization (FAO) has released its latest Country Brief for Sri Lanka, revealing concerning trends in the 2024 main paddy season. Despite hopes for recovery following previous challenges, the island nation faces a complex web of agricultural difficulties that have resulted in below-average rice production, with significant implications for food security and farmer livelihoods.

## 2024 Main Season Performance

### Production Overview
The 2024 main *Maha* paddy season has been characterized by:
- **Overall output**: 15-20% below historical averages
- **Geographic variation**: Significant regional differences in performance
- **Quality concerns**: Pest and disease damage affecting grain quality
- **Timing disruptions**: Delayed harvesting due to weather irregularities
- **Economic impact**: Reduced farmer incomes and increased production costs

### Regional Performance Analysis

#### North Central Province
- **Anuradhapura District**: 25% production decline due to flooding
- **Polonnaruwa District**: 18% reduction from pest outbreaks
- **Water availability**: Irregular tank levels affecting irrigation
- **Farmer adaptation**: Shift to shorter-season varieties

#### Eastern Province
- **Ampara District**: Moderate production with better pest management
- **Batticaloa District**: Flood damage in coastal paddy areas
- **Trincomalee District**: Mixed results with localized challenges

#### Other Regions
- **North Western Province**: Better performance with improved water management
- **Southern Province**: Limited paddy cultivation, focus on other crops
- **Uva Province**: Small-scale production affected by drought conditions

## Climate-Related Challenges

### Irregular Rainfall Patterns
The 2024 season experienced unprecedented weather variability:

#### Pre-Season Conditions (March-May 2024)
- **Delayed onset**: Monsoon rains started 2-3 weeks late
- **Dry spell impact**: Initial planting delayed across major regions
- **Water stress**: Tank levels below optimal at season start
- **Temperature extremes**: Higher than average day temperatures

#### Mid-Season Weather (June-August 2024)
- **Localized flooding**: Intense rainfall in traditionally dry areas
- **Uneven distribution**: Some areas flooded while others remained dry
- **Wind damage**: Cyclonic conditions affecting standing crops
- **Humidity spikes**: Creating favorable conditions for diseases

#### Late Season Patterns (September-November 2024)
- **Harvest disruptions**: Continuous rains delaying harvesting
- **Quality deterioration**: Moisture affecting grain quality
- **Access problems**: Flooded fields preventing machinery use
- **Storage challenges**: High humidity affecting post-harvest handling

### Climate Change Indicators
Long-term data reveals concerning trends:
- **Temperature increase**: 0.8°C average rise over past decade
- **Rainfall variability**: 35% increase in season-to-season variation
- **Extreme events**: Doubling of severe weather incidents
- **Sea level impact**: Saltwater intrusion in coastal areas
- **Drought frequency**: Increased dry spell duration and intensity

## Pest and Disease Pressure

### Major Pest Outbreaks

#### Brown Planthopper (Nilaparvata lugens)
- **Geographic spread**: Extensive infestations in NCP and EP
- **Damage assessment**: 20-40% yield losses in affected areas
- **Resistance development**: Some BPH populations showing insecticide resistance
- **Economic impact**: Increased control costs and reduced profits
- **Environmental concerns**: Heavy pesticide use affecting beneficial insects

**Management challenges**:
- Limited access to effective biologicals
- Inadequate monitoring and early warning
- Farmer knowledge gaps on integrated management
- Chemical resistance reducing control options

#### Rice Hispa (Dicladispa armigera)
- **Outbreak locations**: Scattered infestations across multiple districts
- **Damage pattern**: Leaf mining reducing photosynthetic capacity
- **Control difficulties**: Limited biological control options
- **Yield impact**: 10-25% losses in severely affected fields

#### Stem Borer Complex
- **Species involved**: Yellow stem borer and pink stem borer
- **Damage assessment**: Dead heart and white ear formation
- **Seasonal variation**: Higher pressure during extended wet periods
- **Management needs**: Improved cultural practices and biological control

### Disease Challenges

#### Blast Disease (Pyricularia oryzae)
- **Favorable conditions**: High humidity and temperature fluctuations
- **Symptom development**: Neck blast and leaf blast in susceptible varieties
- **Geographic distribution**: Widespread across all growing regions
- **Yield impact**: 15-30% losses in severely affected fields
- **Resistance breakdown**: Some popular varieties showing increased susceptibility

**Contributing factors**:
- Continuous cultivation of susceptible varieties
- High nitrogen fertilizer use
- Dense planting practices
- Inadequate field sanitation

#### Bacterial Leaf Blight (Xanthomonas oryzae)
- **Weather correlation**: Increased incidence following flooding
- **Transmission**: Water and wind dispersal during storms
- **Damage pattern**: V-shaped lesions reducing leaf area
- **Management challenges**: Limited resistant varieties available

#### Sheath Blight (Rhizoctonia solani)
- **Environmental factors**: High humidity and dense canopy conditions
- **Damage progression**: Stem infection leading to lodging
- **Control difficulties**: Soil-borne pathogen persistence
- **Economic threshold**: Difficult to determine optimal treatment timing

### Integrated Pest Management Gaps
Current IPM implementation faces several constraints:
- **Knowledge transfer**: Limited extension service reach
- **Technology access**: High-quality biologicals not readily available
- **Economic barriers**: IPM practices often more expensive initially
- **Institutional support**: Weak coordination between agencies
- **Research gaps**: Limited local adaptation of IPM strategies

## Water Management Challenges

### Irrigation System Performance

#### Major Irrigation Schemes
- **System efficiency**: Average 60-65%, below optimal 75-80%
- **Infrastructure condition**: Aging channels and structures need repair
- **Water delivery**: Inequitable distribution between head and tail areas
- **Maintenance backlogs**: Insufficient funding for system upkeep

#### Tank Irrigation Systems
- **Water storage**: Below-average levels at season start
- **Siltation problems**: Reduced storage capacity from sediment buildup
- **Community management**: Weakening of traditional farmer organizations
- **Climate vulnerability**: Increased dependence on uncertain rainfall

### Water Use Efficiency
Opportunities exist for improved water management:
- **Alternate wetting and drying**: Potential 20-30% water savings
- **Laser land leveling**: Improved field water distribution
- **Timely planting**: Coordinated water use across command areas
- **Crop establishment**: Direct seeding vs. transplanting considerations

## Market and Economic Implications

### Price Dynamics
The production shortfall has created market pressures:

#### Domestic Prices
- **Farm gate prices**: 15-20% increase over previous year
- **Consumer prices**: Rice prices up 12% in urban markets
- **Regional variation**: Higher prices in deficit production areas
- **Quality premiums**: Better quality rice commanding higher prices

#### Import Requirements
- **Projected imports**: 150,000-200,000 MT for 2024
- **Import timing**: Strategic reserves building during harvest season
- **Quality specifications**: Focus on medium and high-quality varieties
- **Foreign exchange**: Additional $75-100 million import bill

### Farmer Economics
Production challenges directly impact farm households:
- **Reduced incomes**: 20-35% decline in gross farm income
- **Increased costs**: Higher input costs for pest and disease control
- **Credit pressures**: Difficulty repaying seasonal loans
- **Risk aversion**: Farmers considering crop diversification
- **Migration trends**: Some farmers seeking off-farm employment

## Government Response and Policy Measures

### Immediate Support Measures

#### Emergency Assistance
- **Pest control support**: Subsidized pesticide distribution
- **Technical assistance**: Extension officer deployment to affected areas
- **Crop insurance**: Claim processing for weather-related losses
- **Credit relief**: Restructuring of agricultural loans
- **Input subsidies**: Fertilizer and seed support for next season

#### Market Intervention
- **Price support**: Guaranteed purchase prices for paddy
- **Storage expansion**: Additional warehousing capacity
- **Import management**: Strategic reserves to stabilize markets
- **Distribution networks**: Ensuring rural area food access

### Medium-term Strategies

#### Climate Adaptation
- **Variety development**: Stress-tolerant and disease-resistant varieties
- **Water management**: Irrigation system modernization
- **Early warning**: Weather and pest monitoring systems
- **Capacity building**: Farmer training on climate-smart practices

#### Technology Promotion
- **Precision agriculture**: Soil testing and site-specific management
- **Mechanization**: Reducing labor dependency and improving efficiency
- **Digital services**: Mobile-based advisory and market information
- **Research collaboration**: University-farmer partnerships

## International Cooperation and Support

### FAO Assistance Programs
- **Technical expertise**: Pest and disease management support
- **Capacity building**: Training programs for agricultural officers
- **Policy advice**: Strategic planning and implementation guidance
- **Emergency response**: Rapid assistance during crisis periods

### Other Development Partners
- **World Bank**: Agricultural productivity enhancement projects
- **Asian Development Bank**: Infrastructure and technology investments
- **Bilateral cooperation**: Technical exchange with regional countries
- **Private sector**: Technology transfer and value chain development

## Lessons and Recommendations

### Short-term Priorities

#### 1. Enhanced Monitoring Systems
- **Pest surveillance**: Regular monitoring and early warning
- **Weather monitoring**: Local weather station networks
- **Crop condition assessment**: Satellite and ground-based monitoring
- **Market intelligence**: Price and demand information systems

#### 2. Rapid Response Capabilities
- **Emergency protocols**: Quick response to outbreak situations
- **Resource mobilization**: Rapid deployment of inputs and expertise
- **Coordination mechanisms**: Effective agency collaboration
- **Communication systems**: Timely farmer advisories

### Medium-term Development

#### 1. Resilience Building
- **Variety development**: Multi-stress tolerant rice varieties
- **Infrastructure improvement**: Climate-proof irrigation systems
- **Institutional strengthening**: Farmer organization capacity
- **Knowledge systems**: Improved extension and advisory services

#### 2. Sustainable Intensification
- **Productivity enhancement**: Yield gap reduction strategies
- **Resource efficiency**: Water and nutrient use optimization
- **Environmental protection**: Reduced pesticide dependence
- **Economic viability**: Profitable and sustainable farming systems

### Long-term Vision

#### 1. Climate-Smart Agriculture
- **Adaptation strategies**: Long-term climate change preparation
- **Mitigation contributions**: Reduced greenhouse gas emissions
- **Ecosystem services**: Biodiversity and soil health protection
- **Technology integration**: Digital and precision agriculture adoption

#### 2. Value Chain Development
- **Post-harvest systems**: Reduced losses and quality improvement
- **Market linkages**: Better farmer-consumer connections
- **Value addition**: Processing and product development
- **Export potential**: Quality rice for international markets

## Conclusion

The 2024 main paddy season's below-average performance serves as a stark reminder of the vulnerabilities facing Sri Lankan agriculture. The combination of climate variability, pest pressure, and systemic challenges requires comprehensive and coordinated responses across multiple levels.

**Immediate needs include**:
- Enhanced pest and disease management support
- Improved water management and irrigation efficiency
- Strengthened early warning and response systems
- Targeted support for affected farming communities

**Long-term requirements encompass**:
- Climate-resilient agricultural systems development
- Sustainable intensification of rice production
- Diversified and robust rural economies
- Strong institutional capacity for agricultural development

The challenges faced in 2024 are likely to become more frequent and intense due to climate change. Building resilience in Sri Lanka's rice production systems is not just an agricultural necessity but a national food security imperative. Success will require sustained commitment, adequate investment, and coordinated action across government, development partners, and farming communities.

The path forward demands both immediate crisis response and long-term transformation. Only through comprehensive approaches that address technical, institutional, and policy dimensions can Sri Lanka ensure food security and prosperous rural communities in an increasingly uncertain climate.

---

*This analysis is based on the FAO Country Brief for Sri Lanka dated June 24, 2024, supplemented with field reports and additional data from agricultural development partners.*`
    }
  };

  useEffect(() => {
    if (id && articleData[id]) {
      setArticle(articleData[id]);
      // Check if article is saved
      const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
      setIsSaved(savedArticles.includes(id));
    } else {
      // Article not found, redirect to blog
      navigate('/blog');
    }
  }, [id, navigate]);

  const handleShare = async () => {
    if (!article) return;
    
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Article shared successfully!",
          description: "Thank you for sharing this article."
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!",
          description: "You can now paste and share this link."
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share the article. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (!article) return;
    
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedArticles.filter(articleId => articleId !== id);
      localStorage.setItem('savedArticles', JSON.stringify(updated));
      setIsSaved(false);
      toast({
        title: "Article removed from saved",
        description: "The article has been removed from your saved articles."
      });
    } else {
      // Add to saved
      savedArticles.push(id);
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      setIsSaved(true);
      toast({
        title: "Article saved!",
        description: "The article has been saved to your reading list."
      });
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Split content into paragraphs for better formatting
  const contentParagraphs = article.content.split('\n\n');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          <div className="mb-8 rounded-xl overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-96 object-cover"
            />
          </div>
          
          <div className="mb-8">
            <Badge variant="outline" className="mb-4">
              {article.category}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {article.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Actions */}
            <div className="flex gap-2 mb-8">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleSave}>
                {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {contentParagraphs.map((paragraph, index) => {
              // Handle different types of content
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                );
              } else if (paragraph.startsWith('###')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              } else if (paragraph.startsWith('####')) {
                return (
                  <h4 key={index} className="text-lg font-semibold mt-4 mb-2">
                    {paragraph.replace('####', '').trim()}
                  </h4>
                );
              } else if (paragraph.startsWith('- ')) {
                // Handle bullet points
                const bullets = paragraph.split('\n').filter(line => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside mb-4 space-y-1">
                    {bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              } else if (paragraph.includes('**')) {
                // Handle bold text
                const parts = paragraph.split('**');
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {parts.map((part, partIndex) => 
                      partIndex % 2 === 1 ? (
                        <strong key={partIndex}>{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              } else if (paragraph.trim() === '---') {
                return <Separator key={index} className="my-8" />;
              } else if (paragraph.trim().startsWith('*') && paragraph.trim().endsWith('*')) {
                return (
                  <p key={index} className="text-sm text-muted-foreground italic mb-4">
                    {paragraph.replace(/\*/g, '')}
                  </p>
                );
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Related Articles */}
          <Separator className="my-12" />
          
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(articleData)
                .filter(relatedArticle => relatedArticle.id !== article.id)
                .slice(0, 2)
                .map((relatedArticle) => (
                <Card key={relatedArticle.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">
                      {relatedArticle.category}
                    </Badge>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {relatedArticle.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {relatedArticle.excerpt}
                    </p>
                    <Button variant="outline" className="gap-2" asChild>
                      <Link to={`/blog/article/${relatedArticle.id}`}>
                        Read More
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;