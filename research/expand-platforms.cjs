// October 15 user-approved expansion. Numerical profiles are editorial estimates.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const write=(f,v)=>fs.writeFileSync(path.join(root,f),JSON.stringify(v,null,2)+'\n');
const data=read('scores.json'),dirs=['N','NE','E','SE','S','SW','W','NW'];
const records=[
 ['magnific-platform','Magnific',[3.5,2.75,3,2,3,3,4,3.25],[-.22,.16],
  'A broad studio: branch visual ideas, connect models in Spaces, then turn a workflow into a repeatable app.',
  'Magnific creative suite: Spaces node canvas, model selection, apps and agents; paid feature availability varies.',
  'The full studio is scored here; the Design and making entry describes the narrower upscaling workflow. Model switching does not guarantee fidelity.',
  'https://www.magnific.com/','Magnific creative platform',
  'Image, video and audio models, node-based Spaces, reusable apps and agents are presented as one production environment.',
  ['Reusable node chains execute a specified production plan.','References and saved workflows constrain repeated production.','Image editing and reference inputs support preservation, with model-dependent drift.','Agents can propose variations around supplied brand material.','Agents and branching workflows invite alternative directions.','Multiple generators open distinct creative routes.','Image, video and audio generation span a wide inventive field.','Explicit node connections make novel production steerable.']],
 ['higgsfield','Higgsfield',[3.25,1.75,2.25,1.25,2.75,2.75,3.75,3.25],[-.36,.03],
  'A cinematic field: strong camera direction, expansive motion, and looser attachment to the original frame.',
  'Higgsfield video-first studio and model library, with Camera Controls and Cinema Studio; model and plan limits apply.',
  'A camera preset directs a move; it does not guarantee exact subject geometry or frame-by-frame preservation.',
  'https://higgsfield.ai/camera-controls','Higgsfield Camera Controls',
  'Camera presets include dolly, crane, tracking and orbit moves, alongside the platform image and video workspaces.',
  ['Named camera moves allow a user to specify the cinematic action.','Camera direction and source-frame continuity can be combined, with imperfect precision.','Reference-led video keeps some source identity but can reinterpret it.','Reference variations remain possible but are less central than motion exploration.','Presets invite discovery of different cinematic treatments.','Motion and effects propose substantial visual departures.','Generative video supports new scenes and transformations.','Camera controls provide a strong directed-generative shoulder.']],
 ['krea-platform','Krea',[3.5,2,2.75,2,3.25,3.25,4,3.5],[-.30,.22],
  'A live creative instrument: realtime exploration grows into model chains, Nodes and agent-built workflows.',
  'Krea creative suite: realtime image generation, multiple image/video models, Nodes and Nodes Agent on eligible plans.',
  'Realtime feedback gives creative control, not exact recovery of the source. The Design entry emphasizes image-making rather than the whole platform.',
  'https://www.krea.ai/','Krea creative suite',
  'The suite lists realtime creation, multiple image/video models, App Builder and Nodes Agent.',
  ['Nodes encode a chosen sequence of transformations.','Reference-led node workflows allow bounded variations.','Source conditioning is supported but transformations may replace detail.','Existing visual material can seed multiple connected proposals.','The agent and realtime loop support alternative routes.','Realtime generation encourages rapid speculative exploration.','The model range sustains broad visual invention.','A live canvas and editable nodes give invention strong human direction.']],
 ['firefly-platform','Adobe Firefly',[3.75,3.5,3.75,2.25,2.5,2.5,3.5,3], [.23,.35],
  'A production-weighted studio: generate across models, then carry the work into precise Creative Cloud edits.',
  'Firefly and available partner models across Firefly and Creative Cloud apps; capabilities depend on app, model and plan.',
  'This profile includes integrated editing workflows; not every partner model inherits every Adobe control or preservation guarantee.',
  'https://helpx.adobe.com/creative-cloud/apps/generative-ai/non-adobe-models-in-adobe-products.html','Partner models in Adobe products',
  'Adobe documents partner-model availability across Firefly generation, Boards, Graph and selected Creative Cloud applications.',
  ['Integrated editors support explicit production decisions.','Selective editing within a supplied composition is a strong joint workflow.','Existing assets and local editing support comparatively strong preservation.','Boards and references enable proposals anchored to source material.','Multi-model exploration supplies creative alternatives.','Generative models propose new visual routes.','Image and video generators extend beyond supplied assets.','Creative Cloud tools and generation combine bounded invention with editing.']],
 ['comfyui','ComfyUI',[4,3,3.25,.75,2,1.25,4,3.75],[.05,.58],
  'An engineered cloud: enormous freedom inside an explicit graph, with every step and parameter exposed.',
  'Open-source ComfyUI node workflows on local hardware or Comfy Cloud; optional models, nodes and agents require setup.',
  'Scores assume a configured workflow. Installing a model alone does not supply a finished creative direction or reliable preservation.',
  'https://comfy.org/','Comfy visual AI platform',
  'Local and cloud node workflows expose models, parameters and processing steps; an optional agent can build and run workflows.',
  ['Editable nodes and parameters make execution unusually explicit.','Conditioning and compositing can be wired into a controlled source workflow.','Appropriate masks and conditioning preserve selected information.','Source-bound proposals need deliberate graph construction.','Optional agents and templates can suggest workflow directions.','Creative alternatives are possible but not inherent to a bare graph.','Open and partner generators provide broad inventive reach.','Explicit pipelines strongly support human-directed novel output.']],
 ['figma-weave','Figma Weave',[3.75,3.25,3.5,2,2.75,2.5,3.5,3.25],[.15,.38],
  'Design logic becomes a connected canvas: branch, remix and resize a visual system without losing its starting point.',
  'Figma Weave, formerly Weavy: node-based image/video workflows and connections with Figma design assets.',
  'Layout and asset reuse provide constraints; generated imagery can still diverge from the original visual language.',
  'https://www.figma.com/blog/five-figma-weave-workflows/','Five Figma Weave workflows',
  'Documented workflows connect references, generation nodes, variations and aspect-ratio outputs on a canvas.',
  ['Visible node chains make production logic reusable.','Reference and aspect-ratio nodes join controlled output to an existing system.','Starting assets and design context encourage consistency.','Variations can remain linked to a supplied visual language.','Branching nodes invite several design alternatives.','Remixed inputs open new creative possibilities.','Image and video models support substantial invention.','Editable workflow structure directs that invention.']],
 ['flora','FLORA',[3,1.75,2.25,2.25,3.75,3.75,4,2.75],[-.34,-.32],
  'An expansive idea space: connect text, images and video, branch outward, and follow the unexpected route.',
  'FLORA infinite canvas connecting text, image and video models; reusable techniques and collaborative creative workflows.',
  'Connections preserve creative context rather than guaranteeing exact pixel or factual fidelity.',
  'https://flora.ai/','FLORA generative canvas',
  'An infinite canvas joins text, image and video models for branching exploration and iterative creative work.',
  ['Connections encode an intended sequence of creative steps.','Reusable techniques constrain production, with flexible interpretation.','Inputs carry references and context into later generations.','Connected references can seed several plausible directions.','The canvas strongly favors branching creative exploration.','Novel ideas can be developed across text, image and video.','Broad model access supports a large generative envelope.','Directed chains temper free exploration with repeatable steps.']],
 ['leonardo','Leonardo',[3,2.25,2.75,1.75,2.75,2.75,3.75,2.75],[-.24,.12],
  'An image-led studio: explore visual styles, guide the composition, then refine a chosen image into an asset.',
  'Leonardo image platform, part of Canva, with image generation, editing, guidance and video options.',
  'Model guidance improves consistency without guaranteeing exact source geometry or typography.',
  'https://leonardo.ai/','Leonardo creative platform',
  'The platform combines image generation, editing and video tools for asset creation and iterative visual work.',
  ['Guidance and editing let a user refine a chosen visual direction.','Guided edits combine source material with explicit choices.','References preserve some composition and identity.','Variants can stay near a provided visual brief.','Style and image exploration supply alternative concepts.','Visual models generate substantially different interpretations.','Image generation is the broadest part of the workflow.','Guidance channels invention toward a chosen composition.']],
 ['openart','OpenArt',[2.75,1.5,2.25,1.75,3.5,3.5,4,2.5],[-.38,-.24],
  'A wide pool of possibilities: move between image, video and audio models, then develop characters and stories.',
  'OpenArt multi-model image, video and audio creation through a shared platform and credit system.',
  'Changing models changes behavior; shared credits do not imply identical controls or consistent identity across all outputs.',
  'https://openart.ai/','OpenArt model platform',
  'OpenArt lists multiple image/video models, image editing, character creation and story-based production workflows.',
  ['Editors and workflow tools direct selected tasks.','Reference controls exist but vary across models.','Character tools help retain identity with variable fidelity.','Source characters can become alternative story treatments.','Story and model exploration invite multiple directions.','A wide model pool creates diverse speculative outputs.','Image, video and audio generation span a broad field.','Prompts and editors provide some directed-generative control.']],
 ['ltx-studio','LTX Studio',[3.5,2.5,2.75,2.5,3.25,3,3.5,3],[-.05,-.12],
  'A narrative cloud: a brief becomes a storyboard, then shot choices, characters and timing shape the film.',
  'LTX Studio storyboard-to-film workflow with multiple image/video models, shot controls and recurring elements.',
  'Character and scene continuity remain probabilistic. The narrative workflow contributes more than model selection alone.',
  'https://ltx.io/blog/how-to-choose-the-right-model','Choosing models in LTX Studio',
  'LTX documents multiple image/video model choices; the studio supports storyboards, camera direction and reference-led shots.',
  ['Shot-level controls and a timeline execute a chosen sequence.','References and recurring elements constrain specified shots.','Character and scene references support partial continuity.','A supplied script can become several storyboard interpretations.','Storyboarding proposes narrative and shot directions.','Concept-to-film can invent substantial visual narratives.','Multiple video models create scenes from prompts and references.','Camera and keyframe choices direct generated scenes.']],
 ['lovart','Lovart',[2.75,1.75,2.5,2.5,4,3.75,4,2.5],[-.20,-.45],
  'Brief in, design directions out: an agent proposes a visual language and carries it across formats.',
  'Lovart design agent: brief-led visual concepts, brand and layout development, editable canvas and multi-format output.',
  'The agent makes design decisions on the user’s behalf; review is still needed for copy, layout detail and brand fidelity.',
  'https://www.lovart.ai/','Lovart design agent',
  'Lovart presents agent-led design across branding, posters, product imagery and other visual design tasks.',
  ['Canvas edits and follow-up requests direct revisions.','Supplied assets and explicit edits constrain parts of a layout.','Brand references can guide output but may be reinterpreted.','A supplied brief or identity can lead to several coherent layouts.','The agent takes substantial responsibility for proposing design directions.','Briefs can expand into new visual concepts and campaigns.','Image and design generation support broad invention.','Specific revisions guide output after the first proposal.']],
 ['google-flow','Google Flow',[3.25,2.25,2.75,1.75,2.75,2.75,3.5,3],[-.18,.05],
  'An image-to-motion pathway: shape a Nano Banana frame, bring it into Veo, then refine the scene.',
  'Google Flow: a single-vendor studio chaining Google image models, including Nano Banana, with Veo video and refinement tools.',
  'Several models from one vendor; not a cross-vendor marketplace. Video generation may change the details of the starting image.',
  'https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-refine-videos/','Refining and editing in Google Flow',
  'Google describes a dedicated image workspace with Nano Banana and image/video refinement controls inside Flow.',
  ['Scene and editing controls direct a chosen shot.','A refined starting frame helps constrain subsequent motion.','Image references retain aspects of subject and composition.','A source frame can support alternative scene treatments.','Prompted scenes offer several possible directions.','Image-to-video can introduce new motion and setting.','Google image and video models support broad visual generation.','Frame preparation and refinement guide that generation.']],
 ['fal','fal',[4,1.75,2,.25,.75,.5,4,3.5],[-.12,.60],
  'A production engine: choose the model, specify the inputs, and execute the call. Creative direction stays with you.',
  'fal developer API for hosted generative models and custom deployments; assumes a developer-controlled integration.',
  'The API runs models; it does not itself supply a creative strategy. Fidelity depends on the selected endpoint and inputs.',
  'https://fal.ai/','fal model API',
  'A unified API and SDK provide image, video, voice and other hosted models, with custom deployment options.',
  ['Explicit API inputs and orchestration execute developer instructions.','Source-preserving operations must be selected and configured per endpoint.','Some models transform supplied inputs; consistency is endpoint-dependent.','The API offers little native source-bound creative direction.','Creative proposals mostly come from the caller or a chosen model.','Open exploration requires an external loop designed by the caller.','Generative endpoints support a very wide range of new output.','Code and parameter choices strongly direct generation.']],
 ['replicate','Replicate',[3.75,2.25,2.75,.5,1.25,.75,3.75,3.25],[.12,.47],
  'A model workbench: run hosted or community models, tune the inputs, and build your own chain of decisions.',
  'Replicate API and model playgrounds for hosted/community models, fine-tuning and custom model deployments.',
  'Community models differ in maintenance, interfaces and preservation behavior; the hosting layer is not a design agent.',
  'https://replicate.com/','Replicate model platform',
  'Replicate hosts community models through a common API and supports fine-tuning and custom deployments with Cog.',
  ['Versioned model calls execute a developer-selected operation.','Task-specific restoration and conditioning can be made explicit.','Input-preserving behavior comes from the selected model rather than the platform.','Exploring variants of a source needs caller-designed orchestration.','Examples and model browsing suggest methods more than complete design directions.','Creative exploration requires deliberate selection and iteration.','Community and hosted generators provide broad inventive options.','Programmatic inputs channel novel output into chosen tasks.']]
];
function profile(row){
 const [id,name,values,center,summary,scope,limitation,url,title,finding,claims]=row;
 const scores=Object.fromEntries(dirs.map((d,i)=>[d,values[i]]));
 return {id,name,category:'platforms',status:'active',scope,summary,limitation,baseScores:scores,visualScores:{...scores},baseCenter:center,center:[...center],
  centerEvidence:{claim:'Editorial placement of the representative workflow: '+summary,sourceIds:['platform'],confidence:'medium',inferred:true},
  sources:[{id:'platform',title,url,finding}],
  evidence:Object.fromEntries(dirs.map((d,i)=>[d,{claim:claims[i],sourceIds:['platform'],confidence:'medium',inferred:true}])),adjustments:[],profileBasis:'Editorial estimate from documented workflow; not a product benchmark.'};
}
const platforms=records.map(profile);
// A small contrast pass: emphasize existing differences without inventing reach.
for(const [id,dir,to,reason] of [
 ['flora','S',4,'Emphasize the canvas-led invitation to explore many possible creative directions.'],
 ['flora','SW',4,'Open the lower-left lobe to distinguish exploratory branching from node-based production.'],
 ['lovart','E',2.75,'Recognize the role of supplied brand material in the brief-to-design workflow.'],
 ['lovart','SE',2.75,'Emphasize brief-bound proposals beside the broad free-invention lobe.'],
 ['comfyui','NE',3.25,'Emphasize source-conditioned execution against the thinner proposal region.'],
 ['higgsfield','NE',1.5,'Keep cinematic direction visibly distinct from exact source preservation.'],
 ['fal','SE',0,'Contract native source-bound proposal reach: the caller supplies the creative direction.']
]){const t=platforms.find(t=>t.id===id);t.adjustments.push({field:dir,from:t.visualScores[dir],to,reason});t.visualScores[dir]=to;}
const deep=data.tools.find(t=>t.id==='deepseek');
const deepValues=[3,2.5,3,2.25,3.25,2.75,3.25,2.25];
Object.assign(deep,{status:'active',summary:'A reasoning-led assistant: work through a problem, read supplied material, and explore possible answers.',scope:'Hosted DeepSeek chat, thinking mode, web search and file-text workflows; availability varies by mode. API and Harness are outside this profile.',limitation:'An estimated teaching profile. Joint workflows are inferred from chat, reasoning and file features rather than measured app-specific tests.',baseScores:Object.fromEntries(dirs.map((d,i)=>[d,deepValues[i]])),visualScores:Object.fromEntries(dirs.map((d,i)=>[d,deepValues[i]])),baseCenter:[.10,-.16],center:[.10,-.16],centerEvidence:{claim:'Reasoned exploration of a question and supplied text is placed near the center, slightly toward proposals and source material.',sourceIds:['d2'],confidence:'low',inferred:true},profileBasis:'Estimated at user request; app-specific joint capabilities are assumptions.'});
const deepClaims=['Instructions guide text and reasoning tasks.','Inferred: explicit instructions can be applied to extracted source text.','File text extraction and web search anchor answers to supplied or retrieved material.','Inferred: source material can be used to propose explanations and alternatives.','Open-ended reasoning can suggest different approaches.','Inferred: conversational reasoning can invent alternative formulations.','Chat generation can draft new text and approaches.','Inferred: specific instructions can steer novel drafting.'];
deep.evidence=Object.fromEntries(dirs.map((d,i)=>[d,{claim:deepClaims[i],sourceIds:['d2'],confidence:'low',inferred:true}]));delete deep.statusEvidence;
data.categories=data.categories.filter(c=>c.id!=='platforms');data.categories.push({id:'platforms',name:'Multi-Model Platforms',note:'Connect models. Shape workflows.'});
data.tools=data.tools.filter(t=>t.category!=='platforms').concat(platforms);data.version=2;
const downloaded=read('research/logo-acquisition.json');
const logoOverrides=Object.fromEntries(downloaded.filter(x=>x.file).map(x=>[x.id,x.file]));
Object.assign(logoOverrides,{'canva-ai':'logos/canva-ai.ico',comfyui:'logos/comfyui.svg',flora:'logos/flora.svg',lovart:'logos/lovart.svg',fal:'logos/fal.svg',replicate:'logos/replicate.svg','magnific-platform':'logos/magnific.svg','krea-platform':'logos/krea.png','firefly-platform':'logos/firefly.png'});
for(const t of data.tools)if(logoOverrides[t.id])t.logo=logoOverrides[t.id];
write('research/platforms.json',platforms);
write('scores.json',data);
console.log('Added 14 platform profiles and estimated DeepSeek. Run prepare-data.cjs.');
