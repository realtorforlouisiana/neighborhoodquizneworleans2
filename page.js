"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MapPin, Sparkles, ArrowRight, ArrowLeft, CheckCircle, Star } from "lucide-react";


// Replace with your actual logo URL if hosting elsewhere

const NEIGHBORHOODS = {
  Lakeview: {
    blurb: "Lakefront breezes, bigger lots, garages, and easy access to City Park — perfect for porches, pups, crawfish boils, and quick I‑10 commutes.",
    emoji: "🌅"
  },
  "Garden District": {
    blurb: "Greek Revival and Italianate stunners under live oaks, with Magazine Street boutiques and the St. Charles streetcar at your doorstep.",
    emoji: "🏛️"
  },
  Marigny: {
    blurb: "Rainbow cottages and shotguns by Frenchmen Street — creative energy, music, courtyards, and bikeable access to the Quarter and riverfront.",
    emoji: "🎷"
  },
  "Mid-City": {
    blurb: "Central, eclectic, and easy-living: Bayou St. John, Lafitte Greenway, coffee shops, and Canal streetcar minutes from the CBD.",
    emoji: "🚲"
  },
  Gentilly: {
    blurb: "Quiet residential streets, bigger yards, and quick drives to UNO and the lakefront—porches, parks, and value.",
    emoji: "🏡"
  }
};

const QUESTIONS = [
  {
    id: "lifestyle",
    title: "What vibe fits your daily life best?",
    options: [
      { id: "space", label: "Space & parking, easygoing lakefront life", scores: { Lakeview: 3 } },
      { id: "historicWalk", label: "Historic charm & walkability to cafés/shops", scores: { "Garden District": 3 } },
      { id: "music", label: "Live music & creative energy nearby", scores: { Marigny: 3 } },
      { id: "central", label: "Central & eclectic: coffee shops + Greenway/Canal streetcar", scores: { "Mid-City": 3 } },
      { id: "quietRes", label: "Quiet residential streets & bigger yards", scores: { Gentilly: 3 } }
    ]
  },
  {
    id: "weekend",
    title: "Your ideal weekend looks like…",
    options: [
      { id: "citypark", label: "Sunset levee walks & City Park adventures", scores: { Lakeview: 3 } },
      { id: "magazine", label: "Magazine Street boutiques & galleries", scores: { "Garden District": 3 } },
      { id: "frenchmen", label: "Frenchmen Street shows & Bywater hangs", scores: { Marigny: 3 } },
      { id: "greenway", label: "Bayou St. John picnics & Lafitte Greenway ride", scores: { "Mid-City": 3 } },
      { id: "gentillyWeekend", label: "Backyard crawfish boils & quick lakefront drives", scores: { Gentilly: 3 } }
    ]
  },
  {
    id: "nightlife",
    title: "Nightlife tolerance",
    options: [
      { id: "quiet", label: "Prefer quiet evenings", scores: { Lakeview: 2, "Garden District": 1, Gentilly: 2, "Mid-City": 1 } },
      { id: "mix", label: "Happy to be in the mix", scores: { Marigny: 2, "Mid-City": 1 } }
    ]
  },
  {
    id: "hometype",
    title: "Dream home type",
    options: [
      { id: "newerGarage", label: "Newer build with driveway/garage", scores: { Lakeview: 2, Gentilly: 1 } },
      { id: "historic", label: "Historic side‑hall / mansion / tasteful condo", scores: { "Garden District": 2 } },
      { id: "shotgun", label: "Shotgun / Creole cottage with charm", scores: { Marigny: 2 } },
      { id: "bungalow", label: "Raised cottage / bungalow with porch", scores: { "Mid-City": 2, Gentilly: 1 } }
    ]
  },
  {
    id: "budget",
    title: "Target purchase budget",
    options: [
      { id: "300-500", label: "$300k–$500k", scores: { Lakeview: 1, Marigny: 1, "Mid-City": 1, Gentilly: 2 } },
      { id: "500-800", label: "$500k–$800k", scores: { Lakeview: 1, Marigny: 1, "Mid-City": 1, Gentilly: 1 } },
      { id: "800-1200", label: "$800k–$1.2M", scores: { "Garden District": 2, Lakeview: 1, "Mid-City": 1 } },
      { id: "1200+", label: "$1.2M+", scores: { "Garden District": 2, Lakeview: 1 } }
    ]
  },
  {
    id: "commute",
    title: "Commute preference",
    options: [
      { id: "i10", label: "Fast I‑10 access", scores: { Lakeview: 1 } },
      { id: "streetcar", label: "Streetcar to CBD/Uptown", scores: { "Garden District": 1, "Mid-City": 1 } },
      { id: "bike", label: "Bikeable to the Quarter/CBD", scores: { Marigny: 1, "Mid-City": 1 } },
      { id: "i610", label: "Quick I‑610/UNO/lakefront access", scores: { Gentilly: 1 } }
    ]
  },
  {
    id: "outdoor",
    title: "Outdoor space",
    options: [
      { id: "yard", label: "I want a real yard for pets/parties", scores: { Lakeview: 2, Gentilly: 2, "Mid-City": 1 } },
      { id: "courtyard", label: "Courtyard/patio is perfect", scores: { "Garden District": 1, Marigny: 1, "Mid-City": 1 } },
      { id: "none", label: "No outdoor space needed", scores: { "Garden District": 1 } }
    ]
  },
  {
    id: "preservation",
    title: "How important is historic character?",
    options: [
      { id: "must", label: "Must‑have (architectural details are non‑negotiable)", scores: { "Garden District": 2, Marigny: 1, "Mid-City": 1 } },
      { id: "nice", label: "Nice‑to‑have", scores: { "Garden District": 1, "Mid-City": 1 } },
      { id: "not", label: "Not important", scores: { Lakeview: 1, Gentilly: 1 } }
    ]
  }
];

function classNames(...arr){ return arr.filter(Boolean).join(" "); }

export default function Page(){
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", phone: "", priceRange: "", timeframe: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = QUESTIONS.length;
  const progress = Math.round(((showResult ? totalSteps : step) / totalSteps) * 100);

  const scores = useMemo(()=>{
    const s = { Lakeview: 0, "Garden District": 0, Marigny: 0, "Mid-City": 0, Gentilly: 0 };
    for(const q of QUESTIONS){
      const sel = answers[q.id];
      if(!sel) continue;
      const opt = q.options.find(o=>o.id===sel);
      if(!opt) continue;
      for(const [n,v] of Object.entries(opt.scores)) s[n]+=v;
    }
    return s;
  }, [answers]);

  const ranked = useMemo(()=>Object.entries(scores).sort((a,b)=>b[1]-a[1]), [scores]);

  function onNext(){
    if(step < totalSteps-1) setStep(s=>s+1);
    else setShowResult(true);
  }
  function onBack(){
    if(showResult){ setShowResult(false); setStep(totalSteps-1); }
    else if(step>0) setStep(s=>s-1);
  }
  function setAnswer(qid, val){ setAnswers(prev=>({ ...prev, [qid]: val })); }
  function handleLeadSubmit(e){
    e.preventDefault();
    // TODO: replace with your CRM endpoint fetch
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-purple-100 text-purple-700">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Neighborhood Match Quiz</h1>
              <p className="text-sm text-gray-600">Find your best fit in Lakeview, the Garden District, the Marigny, Mid‑City, or Gentilly.</p>
            </div>
          </div>
          <span className="badge">New Orleans</span>
        </header>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Answer a few quick questions
            </div>
            <div className="progress"><span style={{width:`${progress}%`}} /></div>
          </div>

          <div className="card-content">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={step}
                  initial={{opacity:0, y:12}}
                  animate={{opacity:1, y:0}}
                  exit={{opacity:0, y:-12}}
                  transition={{duration:0.2}}
                >
                  <StepQuestion
                    index={step}
                    total={totalSteps}
                    question={QUESTIONS[step]}
                    value={answers[QUESTIONS[step].id]}
                    onChange={setAnswer}
                  />
                </motion.div>
              ):(
                <motion.div
                  key="result"
                  initial={{opacity:0, y:12}}
                  animate={{opacity:1, y:0}}
                  exit={{opacity:0, y:-12}}
                  transition={{duration:0.2}}
                >
                  <Results ranked={ranked} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="card-footer flex items-center justify-between">
            <button className="btn btn-ghost" onClick={onBack} disabled={step===0 && !showResult}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {!showResult ? (
              <button className="btn btn-primary" onClick={onNext}>
                {step < totalSteps-1 ? <>Next <ArrowRight className="h-4 w-4"/></> : <>See My Match <ArrowRight className="h-4 w-4"/></>}
              </button>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-purple-600" /> Tip: Click each neighborhood card to compare.
              </div>
            )}
          </div>
        </div>

        {showResult && (
          <motion.section
            initial={{opacity:0, y:12}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.25, delay:0.05}}
            className="mt-8"
          >
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Get a curated listing list in 24 hours
                </div>
                <p className="text-sm text-gray-600 mt-2">Tell me your basics and I’ll send on‑market + private‑tour options that fit your answers.</p>
              </div>
              <div className="card-content">
                {submitted ? (
                  <div className="flex flex-col items-start gap-2 text-green-700">
                    <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5"/> Thanks! I’ll email a custom list shortly.</div>
                    <p className="text-sm text-gray-700">(If you want to tweak anything, just retake the quiz above.)</p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="name">Full Name</label>
                      <input id="name" className="input" value={lead.name} onChange={(e)=>setLead({...lead, name:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="input" value={lead.email} onChange={(e)=>setLead({...lead, email:e.target.value})} required />
                    </div>
                    <div>
                      <label className="label" htmlFor="phone">Phone (optional)</label>
                      <input id="phone" className="input" value={lead.phone} onChange={(e)=>setLead({...lead, phone:e.target.value})} />
                    </div>
                    <div>
                      <label className="label">Price Range</label>
                      <select className="select" value={lead.priceRange} onChange={(e)=>setLead({...lead, priceRange:e.target.value})}>
                        <option value="">Select</option>
                        <option value="300-500">$300k–$500k</option>
                        <option value="500-800">$500k–$800k</option>
                        <option value="800-1200">$800k–$1.2M</option>
                        <option value="1200+">$1.2M+</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Timeframe</label>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {["0-3","3-6","6-12"].map(v => (
                          <button type="button" key={v}
                            onClick={()=>setLead({...lead, timeframe:v})}
                            className={classNames("radio-label", lead.timeframe===v ? "active":"inactive")}>
                            {v.replace("-", "–")} months
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">By submitting, you agree to be contacted about real estate opportunities in New Orleans.</div>
                      <button type="submit" className="btn btn-primary">Get Listings & Alerts</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.section>
        )}

        <footer className="mt-10 text-xs text-gray-500 max-w-3xl">
          <p>Built for Jessica Bordelon, REALTOR® (BHHS). Demo only; match results are guidance, not guarantees.</p>
        </footer>
      </div>
    </div>
  );
}

function StepQuestion({ index, total, question, value, onChange }){
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">Question {index + 1} of {total}</p>
        <span className="badge">{question.id}</span>
      </div>
      <h2 className="text-xl font-semibold mb-4">{question.title}</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {question.options.map(opt => (
          <OptionCard
            key={opt.id}
            active={value===opt.id}
            label={opt.label}
            onClick={()=>onChange(question.id, opt.id)}
          />
        ))}
      </div>
    </div>
  );
}

function OptionCard({ active, label, onClick }){
  return (
    <button type="button" onClick={onClick}
      className={classNames("text-left p-4 rounded-2xl border transition-all",
        "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300",
        active ? "border-purple-600 bg-purple-50" : "border-gray-200 bg-white")}>
      <div className="flex items-start gap-3">
        <Star className={classNames("h-5 w-5 mt-0.5", active ? "text-purple-600":"text-gray-300")} />
        <span className="text-sm md:text-base">{label}</span>
      </div>
    </button>
  );
}

function Results({ ranked }){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Neighborhood Matches</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {ranked.map(([name, score], i) => (
          <NeighborhoodCard key={name} name={name} score={score} rank={i+1} />
        ))}
      </div>
    </div>
  );
}

function NeighborhoodCard({ name, score, rank }){
  const data = NEIGHBORHOODS[name];
  return (
    <div className={classNames("p-5 rounded-2xl border bg-white hover:shadow-sm transition-all",
      rank===1 ? "border-purple-600":"border-gray-200")}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Rank #{rank}</div>
          <h3 className="text-lg font-bold mt-1 flex items-center gap-2">{data.emoji} {name}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Score</div>
          <div className="text-2xl font-extrabold text-purple-700">{score}</div>
        </div>
      </div>
      <p className="text-sm text-gray-700 mt-3">{data.blurb}</p>
      <ul className="mt-3 space-y-1 text-sm text-gray-600 list-disc list-inside">
        {name === "Lakeview" && (<>
          <li>Levee paths & Lake Pontchartrain sunsets</li>
          <li>City Park museums, golf, and festivals nearby</li>
          <li>Driveways, garages, and bigger backyards</li>
        </>)}
        {name === "Garden District" && (<>
          <li>Magazine Street cafés, galleries & shopping</li>
          <li>St. Charles streetcar & oak‑lined boulevards</li>
          <li>Preserved architecture with modern comforts</li>
        </>)}
        {name === "Marigny" && (<>
          <li>Frenchmen Street live music & nightlife</li>
          <li>Colorful cottages, shotguns, and courtyards</li>
          <li>Quick bike rides to the Quarter & riverfront</li>
        </>)}
        {name === "Mid-City" && (<>
          <li>Bayou St. John & Lafitte Greenway</li>
          <li>Canal streetcar; central to CBD & hospitals</li>
          <li>Bungalows, doubles & deep front porches</li>
        </>)}
        {name === "Gentilly" && (<>
          <li>Quiet streets & larger yards</li>
          <li>Quick drives to UNO & the lakefront</li>
          <li>Post‑war cottages, ranches & raised homes</li>
        </>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="badge">New Orleans</span>
        <span className="badge">Walkability</span>
        <span className="badge">Lifestyle Fit</span>
      </div>
    </div>
  );
}
