import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Globe2,
  Handshake,
  Landmark,
  UsersRound,
} from "lucide-react";

const services = [
  { icon: UsersRound, title: "TALENT SOLUTIONS", body: "Connecting the right talent with the right opportunities." },
  { icon: BriefcaseBusiness, title: "BUSINESS CONSULTING", body: "Strategic solutions for sales, marketing & business growth." },
  { icon: BarChart3, title: "TRAINING & DEVELOPMENT", body: "Upskill, lead, and grow with industry-relevant programs." },
  { icon: Handshake, title: "NETWORKING & COMMUNITY", body: "Bridging professionals and organizations for impact." },
];

const metrics = [
  { icon: UsersRound, value: "10,000+", label: "Professionals", sub: "Connected" },
  { icon: Building2, value: "500+", label: "Partner", sub: "Organizations" },
  { icon: BriefcaseBusiness, value: "2,000+", label: "Career Opportunities", sub: "Shared" },
  { icon: Landmark, value: "150+", label: "Training & Workshops", sub: "Conducted" },
  { icon: Globe2, value: "Nationwide", label: "Impact Across", sub: "Industries" },
];

export function BECHomepage() {
  return (
    <main className="bec-page">
      <style>{`
        .bec-page{min-height:100dvh;background:#fbfcfb;color:#14202d;font-family:"Plus Jakarta Sans","Avenir Next",sans-serif;overflow:hidden;position:relative}
        .bec-page:before{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(#d8e8e2 1px,transparent 1px);background-size:14px 14px;opacity:.12;mask-image:linear-gradient(90deg,transparent 0%,black 23%,transparent 78%)}
        .bec-shell{width:min(100%,1220px);margin:0 auto;position:relative;z-index:1}
        .bec-nav{height:67px;position:relative;border-bottom:1px solid #e4e9e6;border-radius:0 0 0 70px;background:rgba(255,255,255,.92);display:flex;align-items:center;padding:0 24px 0 34px;gap:28px;overflow:hidden}
        .bec-nav-contour{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
        .bec-brand{display:flex;align-items:center;gap:10px;margin-right:auto;white-space:nowrap;position:relative;z-index:1}
        .bec-mark{width:76px;height:38px;flex:none;font-size:0;background:url("/__mockup/images/bec-reference.png") no-repeat -32px -27px / 1024px auto}
        .bec-brand-rule{height:33px;width:1px;background:#cdd5d1}.bec-brand-name{font-size:12px;line-height:1.05;font-weight:800;color:#101823;letter-spacing:-.3px}.bec-brand-name span{font-size:10px;font-weight:600}
        .bec-links{display:flex;align-items:center;gap:25px;font-size:11px;color:#151c20;position:relative;z-index:1}.bec-links button{border:0;background:none;font:inherit;padding:8px 0;cursor:pointer;white-space:nowrap}.bec-links button:first-child{border-bottom:2px solid #c59e49;padding-bottom:11px}
        .bec-join{border:0;background:#08735d;color:#fff;border-radius:18px;padding:9px 13px 9px 16px;font-size:10px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 3px 9px #08735d22;position:relative;z-index:1}.bec-join svg{width:13px}
        .bec-hero{height:465px;position:relative;display:flex;padding:72px 42px 0}
        .bec-backdrop{position:absolute;right:-100px;top:10px;width:700px;height:500px;border-radius:50%;background:radial-gradient(ellipse at center,#f3f8f6 0%,rgba(243,248,246,.72) 44%,transparent 72%);z-index:-1}
        .bec-copy{width:380px;position:relative;z-index:3}.bec-kicker{font-size:10px;color:#126c59;font-weight:700;margin-bottom:20px}.bec-title{font-size:34px;line-height:1.12;letter-spacing:-1.5px;font-weight:800;margin:0}.bec-title em{display:block;color:#08735d;font-style:normal}.bec-title em:after{content:"";display:inline-block;width:5px;height:5px;background:#bd9440;border-radius:50%;margin:0 0 5px 2px}
        .bec-divider{width:38px;height:2px;background:#c09643;margin:18px 0}.bec-desc{font-size:11px;line-height:1.8;color:#5d6870;width:335px;margin:0}.bec-actions{display:flex;gap:16px;margin-top:20px}.bec-actions button{height:34px;border-radius:7px;padding:0 16px;font-size:10px;cursor:pointer;display:flex;align-items:center;gap:10px}.bec-primary{color:#fff;background:#08735d;border:1px solid #08735d}.bec-secondary{color:#145d51;background:#fff;border:1px solid #398374}.bec-actions svg{width:14px}
        .bec-art{position:absolute;left:340px;top:28px;width:500px;height:400px;overflow:hidden;z-index:1}.bec-art img{position:absolute;width:1024px;height:auto;max-width:none;left:-330px;top:-100px;opacity:.98}
        .bec-services{position:absolute;right:35px;top:76px;width:185px;z-index:4}.bec-service{display:flex;gap:11px;align-items:flex-start;margin-bottom:17px}.bec-service-icon{width:42px;height:42px;flex:none;border:1px solid #cfc8b4;border-radius:50%;display:grid;place-items:center;background:#fff;color:#08735d}.bec-service-icon svg{width:18px}.bec-service-copy{border-left:2px solid #207861;padding-left:10px}.bec-service h3{font-size:9px;color:#075c4e;margin:3px 0 5px;font-weight:800}.bec-service p{font-size:8px;line-height:1.55;color:#657078;margin:0}
        .bec-ribbon{position:absolute;right:-150px;bottom:-40px;width:610px;height:190px;background:#edf5f1;transform:rotate(-13deg);border-radius:50%;z-index:-2}.bec-ribbon:after{content:"";position:absolute;right:-45px;top:35px;width:570px;height:80px;border-top:16px solid #d8ebe4;border-radius:50%;transform:rotate(4deg)}
        .bec-dots{position:absolute;left:-15px;bottom:18px;width:100px;height:78px;opacity:.65;background-image:radial-gradient(#d7ebe3 1.5px,transparent 1.5px);background-size:12px 12px}
        .bec-stats{height:105px;margin:0 58px;background:rgba(255,255,255,.96);border-radius:14px;box-shadow:0 14px 26px rgba(46,75,68,.13);display:grid;grid-template-columns:repeat(5,1fr);align-items:center;padding:0 20px;position:relative;z-index:5}.bec-stat{height:57px;display:flex;align-items:center;gap:14px;padding:0 16px;border-right:1px solid #e4e8e5}.bec-stat:last-child{border:0}.bec-stat-icon{height:41px;width:41px;border-radius:9px;background:#edf6f2;color:#08735d;display:grid;place-items:center;flex:none}.bec-stat-icon svg{width:21px}.bec-stat-value{font-size:17px;font-weight:700;color:#08735d;line-height:1.1;margin-bottom:7px}.bec-stat-label{font-size:9px;color:#69757a;line-height:1.45;white-space:nowrap}
        @media(max-width:900px){.bec-nav{padding-left:20px}.bec-links{gap:14px}.bec-hero{padding-left:24px}.bec-copy{width:350px}.bec-art{left:285px;opacity:.55}.bec-services{right:10px;width:170px}.bec-stats{margin:0 20px}}
        @media(max-width:700px){.bec-nav{height:auto;min-height:74px;border-radius:0 0 0 34px;flex-wrap:wrap;padding:16px 18px;gap:12px}.bec-brand{width:100%;margin:0}.bec-links{order:3;width:100%;justify-content:space-between;gap:8px;overflow:auto}.bec-links button{font-size:10px}.bec-join{position:absolute;right:16px;top:19px}.bec-hero{height:auto;min-height:760px;padding:42px 22px 30px;display:block}.bec-copy{width:100%}.bec-title{font-size:31px}.bec-desc{width:100%;max-width:350px}.bec-art{left:0;top:270px;width:100%;height:300px;opacity:.7}.bec-art img{left:calc(50% - 270px);top:-40px;width:650px}.bec-services{position:absolute;left:22px;right:22px;top:575px;width:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px}.bec-service{margin:0}.bec-service-icon{width:34px;height:34px}.bec-service-copy{padding-left:7px}.bec-service h3{font-size:8px}.bec-service p{font-size:7px}.bec-ribbon{bottom:100px}.bec-stats{height:auto;margin:0 14px;padding:14px 8px;grid-template-columns:1fr 1fr;gap:8px}.bec-stat{padding:8px;border:0}.bec-stat:nth-child(5){grid-column:1 / -1}.bec-stat-value{font-size:15px}}
      `}</style>
           <div className="bec-shell">
        <nav className="bec-nav" aria-label="Primary navigation">
          <svg className="bec-nav-contour" viewBox="0 0 1220 67" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 1H388C419 1 441 17 462 42C475 57 484 66 506 66H1220" fill="none" stroke="#427263" strokeWidth="1" />
          </svg>
          <div className="bec-brand">
            <div className="bec-mark">B<span>E</span>C</div><div className="bec-brand-rule" />
            <div className="bec-brand-name">BANGLADESH<br />EXECUTIVE CHAMBER <span>/ BEC</span></div>
          </div>
          <div className="bec-links">
            <button type="button">Home</button><button type="button">About Us</button><button type="button">Our Services</button><button type="button" className="flex items-center gap-1">Resources <ChevronDown size={10} /></button><button type="button">Connect Us</button>
          </div>
          <button className="bec-join" type="button">Join BEC <ArrowRight /></button>
        </nav>
        <section className="bec-hero">
          <div className="bec-backdrop" /><div className="bec-dots" /><div className="bec-ribbon" />
          <div className="bec-copy">
            <div className="bec-kicker">PROMOTING BRANDS. EMPOWERING CAREERS.</div>
            <h1 className="bec-title">Building People.<br />Strengthening Brands.<br /><em>Shaping Bangladesh</em></h1>
            <div className="bec-divider" />
            <p className="bec-desc">Bangladesh Executive Chamber (BEC) is a professional ecosystem that empowers careers, strengthens brands, and drives corporate growth through consulting, talent solutions, training, and meaningful connections.</p>
            <div className="bec-actions"><button className="bec-primary" type="button">Explore Our Services <ArrowRight /></button><button className="bec-secondary" type="button">Join Our Network <UsersRound /></button></div>
          </div>
          <div className="bec-art"><img src="/__mockup/images/bec-reference.png" alt="BEC business community illustration" /></div>
          <aside className="bec-services">{services.map(({ icon: Icon, title, body }) => <div className="bec-service" key={title}><div className="bec-service-icon"><Icon /></div><div className="bec-service-copy"><h3>{title}</h3><p>{body}</p></div></div>)}</aside>
        </section>
        <section className="bec-stats" aria-label="BEC impact metrics">{metrics.map(({ icon: Icon, value, label, sub }) => <div className="bec-stat" key={value}><div className="bec-stat-icon"><Icon /></div><div><div className="bec-stat-value">{value}</div><div className="bec-stat-label">{label}<br />{sub}</div></div></div>)}</section>
      </div>
    </main>
  );
}