const fs = require('fs');
const p = 'c:/курсор/dusup-ai google/du-sup/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

// 1. Add videoRef after isHoveredBackToTop
const old1 = 'isHoveredBackToTop, setIsHoveredBackToTop] = useState(false);\r\n\r\n  // Parallax';
const new1 = 'isHoveredBackToTop, setIsHoveredBackToTop] = useState(false);\r\n  const videoRef = useRef<HTMLVideoElement>(null);\r\n\r\n  // Parallax';
if (!c.includes(old1)) { console.log('NOT FOUND 1'); process.exit(1); }
c = c.replace(old1, new1);

// 2. Add useEffect after handleHeroMouseLeave
const old2 = '}, [mouseX, mouseY]);\r\n\r\n  // Load and save';
const new2 = '}, [mouseX, mouseY]);\r\n\r\n  // Slow down hero video playback\r\n  useEffect(() => {\r\n    if (videoRef.current) {\r\n      videoRef.current.playbackRate = 0.7;\r\n    }\r\n  }, []);\r\n\r\n  // Load and save';
if (!c.includes(old2)) { console.log('NOT FOUND 2'); process.exit(1); }
c = c.replace(old2, new2);

// 3. Fix video tag: remove style={{ playbackRate }}, add ref={videoRef}
const old3 = 'className="absolute inset-0 w-full h-full object-cover"\r\n                  style={{ playbackRate: 0.7 }}\r\n                  src=';
const new3 = 'className="absolute inset-0 w-full h-full object-cover"\r\n                  ref={videoRef}\r\n                  src=';
if (!c.includes(old3)) { console.log('NOT FOUND 3'); process.exit(1); }
c = c.replace(old3, new3);

fs.writeFileSync(p, c, 'utf8');
console.log('OK - all 3 replacements done');
