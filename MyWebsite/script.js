const year = document.querySelector("#year");
const languageToggle = document.querySelector("[data-language-toggle]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");
const translatable = document.querySelectorAll("[data-i18n]");
const certBadges = document.querySelectorAll("[data-cert-image]");
const animatedElements = document.querySelectorAll(
  ".stats-band article, .section-heading, .skill-card, .tool-card, .security-card, .work-card, .timeline-item, .experience-total, .education-panel, .cert-list, .contact-section"
);

const languages = ["en", "es", "de", "ar"];
let currentLanguageIndex = 0;
let currentTheme = "dark";

const translations = {
  en: {
    label: "English",
    flag: "flag-en",
    lang: "en",
    dir: "ltr",
    navSkills: "Skills",
    navSnapshots: "Snapshots",
    navExperience: "Experience",
    navWork: "Work",
    navTools: "Tools",
    navContact: "Contact",
    heroEyebrow: "Integration Engineer · Robotics · Security",
    heroTitle: "I build friendly, reliable systems for robots, apps, and connected devices.",
    heroSummary: "Hi, I am Kirsten. I enjoy turning tricky technical pieces into smooth, useful experiences across robotics, Android apps, APIs, embedded systems, Linux, and cybersecurity.",
    emailButton: "Say hello",
    imageGuideTitle: "Image placement",
    imageGuideText: "Add a photo that feels like your work: a robot setup, ESP32 prototype, app screen, dashboard, or bright engineering moment.",
    experiencePinTitle: "2 Years Experience",
    experiencePinText: "Learning, building, testing, and improving real systems",
    statRoboticsTitle: "Robotics",
    statRoboticsText: "Making robot experiences easier to use, test, and deploy",
    statIntegrationTitle: "Integration",
    statIntegrationText: "Helping apps, APIs, hardware, and backend services work together",
    statSecurityTitle: "Security",
    statSecurityText: "Bringing a security-aware eye to networks, logs, and data flows",
    skillsEyebrow: "Technical Range",
    skillsTitle: "A practical mix of code, hardware, security, and curiosity.",
    snapshotsEyebrow: "Work Snapshots",
    snapshotsTitle: "A closer look at the kind of work I enjoy doing.",
    skillProgrammingTitle: "Programming",
    skillProgrammingText: "C/C++, Java, Kotlin, React, SQL, Python, JavaScript, Bash, PowerShell",
    skillRoboticsTitle: "Robotics & Embedded",
    skillRoboticsText: "ROS, ESP32, Android OS, sensor integration, robotics prototyping, hardware-software communication",
    skillMobileTitle: "Mobile & Backend",
    skillMobileText: "Android Studio, REST APIs, Retrofit, OkHttp, Node.js, Express.js, MongoDB, Strapi",
    skillTestingTitle: "Testing & Analysis",
    skillTestingText: "Linux, Ubuntu, Git, Postman, Wireshark, Nmap, protocol analysis, log analysis, bug fixing",
    toolsEyebrow: "What I Work With",
    toolsTitle: "Tools, platforms, and environments I use regularly.",
    toolAwsTitle: "Backend and API connections",
    toolAwsText: "I like making apps, devices, and backend services communicate clearly, especially when authentication and data flow matter.",
    toolCodexTitle: "Android and robot UI work",
    toolCodexText: "I enjoy building interfaces that make robot systems easier to monitor, test, and use in real environments.",
    toolAiTitle: "Security-aware troubleshooting",
    toolAiText: "I use logs, protocol checks, Wireshark, Nmap, and careful testing to understand what is happening inside a system.",
    toolRoboticsTitle: "Robotics and embedded systems",
    toolRoboticsText: "I like the hands-on side: sensors, ESP32, ROS, Linux environments, and hardware-software communication.",
    securityEyebrow: "Cybersecurity Side",
    securityTitle: "Security is part of how I think, not just a separate checklist.",
    securityOneTitle: "I enjoy reading the signals",
    securityOneText: "Wireshark, Nmap, protocol checks, and logs help me understand what a system is really doing.",
    securityTwoTitle: "Safer flows for real users",
    securityTwoText: "I care about authentication, API testing, Apple Sign-In, Google services, and backend communication that feels dependable.",
    securityThreeTitle: "Cybersecurity roots",
    securityThreeText: "My bachelor's in Cybersecurity gives me a strong base in ethical hacking, encryption, PGP, VeraCrypt, and secure thinking.",
    workEyebrow: "Selected Work",
    workTitle: "Real projects, real devices, and a lot of careful problem solving.",
    workOneTag: "Robotics Deployment",
    workOneTitle: "Robot apps that people can actually use",
    workOneText: "Built and improved Android and Node.js experiences for robots in service spaces like retail, aviation, hotels, and customer-facing environments.",
    workTwoTag: "Connected Devices",
    workTwoTitle: "Smart-device connections that feel smooth",
    workTwoText: "Worked on ESP32 and IoT communication flows, including authentication with Google API services and Apple Sign-In.",
    workThreeTag: "Security & Research",
    workThreeTitle: "Security research with a practical goal",
    workThreeText: "Used Wireshark and Nmap to explore protocols, support reverse-engineering efforts, and validate proof-of-concept programs.",
    experienceEyebrow: "Experience",
    experienceTitle: "Growing through hands-on teams, client work, and robot deployments.",
    expOneTitle: "Senior Robotics Engineer · Action to Action Robotics",
    expOneText: "Robotics software development with Java, Kotlin, Android Studio, Retrofit, Node.js, MongoDB, ROS, Linux, Wireshark, API testing tools, and Git. Worked on client solutions for Abu Dhabi Police, Sharjah Government Land Department, DNV, and Emirates National Schools.",
    expTwoTitle: "Technical Engineer · MAXimuz Technology",
    expTwoText: "Supported robotics and embedded system integration, ported functional test programs across hardware variants, validated bug fixes, and helped improve API code and functional coverage before releases.",
    expThreeTitle: "Robotics Engineer · Robo Barista",
    expThreeText: "Conducted integration testing for robotic coffee machine systems, maintained machine documentation, and developed Android applications for embedded system monitoring and integration.",
    expFourTitle: "Integration Engineer · German Cyber-Systems",
    expFourText: "Freelance integration work covering ESP32 smart devices, backend services, secure sign-in flows, API integration, system testing, debugging, and validation.",
    expFiveTitle: "Cyber Security Engineer Intern · German Cyber-Systems",
    expFiveText: "Designed the Nordic Home prototype in Figma, created encryption education material using PGP and VeraCrypt, developed React applications, and coordinated technical work as a senior technical lead.",
    expSixTitle: "Robotics Engineer Intern · Action to Action Robotics",
    expSixText: "Built Android applications for robotics control, improved UI experiences, supported robot deployment, and earned a full-time offer after the internship.",
    educationEyebrow: "Education",
    educationTitle: "Cybersecurity studies with a builder's mindset.",
    educationText: "Bachelor's in Cybersecurity at Paris American International University, specializing in cybersecurity and ethical hacking. High School Diploma from De La Salle University.",
    certificationsTitle: "Certifications",
    certImageHelp: "Certification images: paste badge image links into the certificate image slots in index.html.",
    languagesTitle: "Languages",
    languagesText: "English, Filipino, Arabic C1, German A1, Spanish A2",
    contactEyebrow: "Contact",
    contactTitle: "Have an idea, role, or project? Send it through.",
    contactText: "Based in Dubai and open to integration, robotics, embedded systems, cybersecurity, and software opportunities.",
    formNameLabel: "Name",
    formEmailLabel: "Email",
    formMessageLabel: "Project / message",
    formButton: "Send secure request",
    formSuccess: "Message sent! We'll get back to you soon.",
    footerText: "Integration Engineer · Dubai, UAE",
  },
  es: {
    label: "Español",
    flag: "flag-es",
    lang: "es",
    dir: "ltr",
    navSkills: "Habilidades",
    navSnapshots: "Muestras",
    navExperience: "Experiencia",
    navWork: "Proyectos",
    navTools: "Herramientas",
    navContact: "Contacto",
    heroEyebrow: "Ingeniera de Integración · Robótica · Sistemas Embebidos",
    heroTitle: "Creo sistemas amigables y confiables para robots, apps y dispositivos conectados.",
    heroSummary: "Soy Kirsten Umali, Ingeniera de Integración en Dubái con casi dos años de experiencia en integración robótica, desarrollo Android, sistemas embebidos, pruebas de APIs, entornos Linux e ingeniería enfocada en ciberseguridad.",
    emailButton: "Escríbeme",
    imageGuideTitle: "Espacio para imagen",
    imageGuideText: "Usa aquí un espacio de robótica, un prototipo ESP32, una pantalla Android de control robótico o un dashboard de integración.",
    experiencePinTitle: "2 Años de Experiencia",
    experiencePinText: "Robótica, integración y sistemas seguros",
    statRoboticsTitle: "Robótica",
    statRoboticsText: "Apps Android, sensores, ROS y despliegue de plataformas robóticas",
    statIntegrationTitle: "Integración",
    statIntegrationText: "APIs REST, comunicación backend y validación de pruebas",
    statSecurityTitle: "Seguridad",
    statSecurityText: "Wireshark, Nmap, PGP, VeraCrypt y análisis de protocolos",
    skillsEyebrow: "Alcance Técnico",
    skillsTitle: "Experiencia práctica en software, hardware y sistemas seguros.",
    skillProgrammingTitle: "Programación",
    skillProgrammingText: "C/C++, Java, Kotlin, React, SQL, Python, JavaScript, Bash, PowerShell",
    skillRoboticsTitle: "Robótica y Embebidos",
    skillRoboticsText: "ROS, ESP32, Android OS, integración de sensores, prototipos robóticos y comunicación hardware-software",
    skillMobileTitle: "Mobile y Backend",
    skillMobileText: "Android Studio, APIs REST, Retrofit, OkHttp, Node.js, Express.js, MongoDB, Strapi",
    skillTestingTitle: "Pruebas y Análisis",
    skillTestingText: "Linux, Ubuntu, Git, Postman, Wireshark, Nmap, análisis de protocolos, análisis de logs y corrección de errores",
    toolsEyebrow: "Muestras de trabajo",
    toolsTitle: "Una mirada clara al tipo de trabajo que disfruto hacer.",
    toolAwsTitle: "Conexiones backend y API",
    toolAwsText: "Me gusta hacer que apps, dispositivos y servicios backend se comuniquen con claridad, especialmente cuando importan la autenticacion y los datos.",
    toolCodexTitle: "Trabajo Android y UI para robots",
    toolCodexText: "Disfruto crear interfaces que hacen que los sistemas roboticos sean mas faciles de monitorear, probar y usar.",
    toolAiTitle: "Resolucion de problemas con mirada de seguridad",
    toolAiText: "Uso logs, pruebas de protocolo, Wireshark, Nmap y validacion cuidadosa para entender que ocurre dentro de un sistema.",
    toolRoboticsTitle: "Robotica y sistemas embebidos",
    toolRoboticsText: "Me gusta la parte practica: sensores, ESP32, ROS, Linux y comunicacion entre hardware y software.",
    securityEyebrow: "Enfoque en Ciberseguridad",
    securityTitle: "Ingeniería con mentalidad de seguridad en sistemas, redes y aplicaciones.",
    securityOneTitle: "Análisis de red y protocolos",
    securityOneText: "Experiencia usando Wireshark, Nmap, inspección de protocolos y análisis de logs para entender y depurar sistemas.",
    securityTwoTitle: "Flujos seguros de aplicación",
    securityTwoText: "Experiencia con autenticación, Google API services, Apple Sign-In, pruebas API y comunicación backend más segura.",
    securityThreeTitle: "Base académica en ciberseguridad",
    securityThreeText: "Licenciatura en Ciberseguridad con enfoque en hacking ético, cifrado, PGP, VeraCrypt y pensamiento de sistemas seguros.",
    workEyebrow: "Trabajo Seleccionado",
    workTitle: "Proyectos donde el software se conecta con el mundo físico.",
    workOneTag: "Despliegue Robótico",
    workOneTitle: "Apps para plataformas robóticas en entornos de servicio",
    workOneText: "Desarrollé y optimicé experiencias con Android y Node.js para plataformas robóticas usadas en retail, aviación, hoteles y servicios.",
    workTwoTag: "Dispositivos Conectados",
    workTwoTitle: "Integración de dispositivos inteligentes ESP32",
    workTwoText: "Construí flujos de comunicación hardware-software para sistemas IoT, incluyendo autenticación backend con servicios de Google API y Apple Sign-In.",
    workThreeTag: "Seguridad e Investigación",
    workThreeTitle: "Pruebas de concepto de firmware y análisis de red",
    workThreeText: "Usé Wireshark y Nmap para analizar protocolos, apoyar esfuerzos de ingeniería inversa y validar programas técnicos de prueba de concepto.",
    experienceEyebrow: "Experiencia",
    experienceTitle: "Formada mediante proyectos con clientes, equipos de robótica e integración.",
    expOneTitle: "Senior Robotics Engineer · Action to Action Robotics",
    expOneText: "Desarrollo de software robótico con Java, Kotlin, Android Studio, Retrofit, Node.js, MongoDB, ROS, Linux, Wireshark, herramientas de pruebas API y Git. Trabajé en soluciones para Abu Dhabi Police, Sharjah Government Land Department, DNV y Emirates National Schools.",
    expTwoTitle: "Technical Engineer · MAXimuz Technology",
    expTwoText: "Apoyé la integración de sistemas robóticos y embebidos, porté programas de prueba entre variantes de hardware, validé correcciones y ayudé a mejorar la cobertura funcional y de código de APIs antes de lanzamientos.",
    expThreeTitle: "Robotics Engineer · Robo Barista",
    expThreeText: "Realicé pruebas de integración para máquinas robóticas de café, mantuve documentación técnica y desarrollé aplicaciones Android para monitoreo e integración de sistemas embebidos.",
    expFourTitle: "Integration Engineer · German Cyber-Systems",
    expFourText: "Trabajo freelance de integración con dispositivos ESP32, servicios backend, flujos seguros de inicio de sesión, integración de APIs, pruebas de sistema, depuración y validación.",
    expFiveTitle: "Cyber Security Engineer Intern · German Cyber-Systems",
    expFiveText: "Diseñé el prototipo Nordic Home en Figma, creé material educativo de cifrado con PGP y VeraCrypt, desarrollé aplicaciones React y coordiné tareas técnicas como senior technical lead.",
    expSixTitle: "Robotics Engineer Intern · Action to Action Robotics",
    expSixText: "Construí aplicaciones Android para control robótico, mejoré experiencias de UI, apoyé despliegues de robots y recibí una oferta de tiempo completo después de la pasantía.",
    educationEyebrow: "Educación",
    educationTitle: "Base en ciberseguridad con práctica de ingeniería.",
    educationText: "Licenciatura en Ciberseguridad en Paris American International University, con especialización en ciberseguridad y hacking ético. Diploma de secundaria de De La Salle University.",
    certificationsTitle: "Certificaciones",
    certImageHelp: "Imágenes de certificación: pega los enlaces de badges en los espacios de imagen de index.html.",
    languagesTitle: "Idiomas",
    languagesText: "Inglés, Filipino, Árabe C1, Alemán A1, Español A2",
    contactEyebrow: "Contacto",
    contactTitle: "Construyamos sistemas que funcionen en el mundo real.",
    contactText: "Disponible en Dubái, Emiratos Árabes Unidos, para roles de integración, robótica, sistemas embebidos y software.",
    formNameLabel: "Nombre",
    formEmailLabel: "Email",
    formMessageLabel: "Proyecto / mensaje",
    formButton: "Enviar solicitud segura",
    formSuccess: "¡Mensaje enviado! Nos pondremos en contacto pronto.",
    footerText: "Ingeniera de Integración · Dubái, EAU",
  },
  de: {
    label: "Deutsch",
    flag: "flag-de",
    lang: "de",
    dir: "ltr",
    navSkills: "Skills",
    navSnapshots: "Beispiele",
    navExperience: "Erfahrung",
    navWork: "Arbeit",
    navTools: "Werkzeuge",
    navContact: "Kontakt",
    heroEyebrow: "Integration Engineer · Robotik · Eingebettete Systeme",
    heroTitle: "Ich baue freundliche, verlässliche Systeme für Roboter, Apps und vernetzte Geräte.",
    heroSummary: "Ich bin Kirsten Umali, Integration Engineer in Dubai, mit fast zwei Jahren Erfahrung in Robotik-Integration, Android-Entwicklung, eingebetteten Systemen, API-Tests, Linux-Umgebungen und sicherheitsorientierter Entwicklung.",
    emailButton: "E-Mail senden",
    imageGuideTitle: "Bildbereich",
    imageGuideText: "Nutzen Sie hier ein Robotik-Workspace-Foto, einen ESP32-Prototyp, einen Android-Robotersteuerungs-Screen oder ein Integrationsdashboard.",
    experiencePinTitle: "2 Jahre Erfahrung",
    experiencePinText: "Robotik, Integration und sichere Systeme",
    statRoboticsTitle: "Robotik",
    statRoboticsText: "Android-Apps, Sensoren, ROS und Deployment von Roboterplattformen",
    statIntegrationTitle: "Integration",
    statIntegrationText: "REST-APIs, Backend-Kommunikation und Testvalidierung",
    statSecurityTitle: "Security",
    statSecurityText: "Wireshark, Nmap, PGP, VeraCrypt und Protokollanalyse",
    skillsEyebrow: "Technisches Profil",
    skillsTitle: "Praxis in Software, Hardware und sicheren Systemen.",
    skillProgrammingTitle: "Programmierung",
    skillProgrammingText: "C/C++, Java, Kotlin, React, SQL, Python, JavaScript, Bash, PowerShell",
    skillRoboticsTitle: "Robotik & Embedded",
    skillRoboticsText: "ROS, ESP32, Android OS, Sensorintegration, Robotik-Prototyping und Hardware-Software-Kommunikation",
    skillMobileTitle: "Mobile & Backend",
    skillMobileText: "Android Studio, REST-APIs, Retrofit, OkHttp, Node.js, Express.js, MongoDB, Strapi",
    skillTestingTitle: "Testing & Analyse",
    skillTestingText: "Linux, Ubuntu, Git, Postman, Wireshark, Nmap, Protokollanalyse, Log-Analyse und Bugfixing",
    toolsEyebrow: "Arbeitsbeispiele",
    toolsTitle: "Ein klarer Blick auf die Arbeit, die ich gerne mache.",
    toolAwsTitle: "Backend- und API-Verbindungen",
    toolAwsText: "Ich mag es, Apps, Geraete und Backend-Services klar miteinander sprechen zu lassen, besonders bei Authentifizierung und Datenfluss.",
    toolCodexTitle: "Android- und Roboter-UI-Arbeit",
    toolCodexText: "Ich baue gerne Oberflaechen, die Robotersysteme leichter ueberwachbar, testbar und nutzbar machen.",
    toolAiTitle: "Troubleshooting mit Security-Blick",
    toolAiText: "Ich nutze Logs, Protokollchecks, Wireshark, Nmap und sorgfaeltiges Testen, um Systeme wirklich zu verstehen.",
    toolRoboticsTitle: "Robotik und Embedded Systems",
    toolRoboticsText: "Ich mag die praktische Seite: Sensoren, ESP32, ROS, Linux und Kommunikation zwischen Hardware und Software.",
    securityEyebrow: "Cybersecurity-Fokus",
    securityTitle: "Security-orientiertes Engineering für Systeme, Netzwerke und Anwendungen.",
    securityOneTitle: "Netzwerk- & Protokollanalyse",
    securityOneText: "Erfahrung mit Wireshark, Nmap, Protokollinspektion und Log-Analyse, um Systemverhalten zu verstehen und Fehler zu beheben.",
    securityTwoTitle: "Sichere App-Flows",
    securityTwoText: "Erfahrung mit Authentifizierung, Google API Services, Apple Sign-In, API-Testing und sichererer Backend-Kommunikation.",
    securityThreeTitle: "Akademische Cybersecurity-Basis",
    securityThreeText: "Bachelor in Cybersecurity mit Fokus auf Ethical Hacking, Verschlüsselungskonzepte, PGP, VeraCrypt und sichere Systeme.",
    workEyebrow: "Ausgewählte Arbeit",
    workTitle: "Projekte, in denen Software auf die physische Welt trifft.",
    workOneTag: "Robotik-Deployment",
    workOneTitle: "Apps für Roboterplattformen in Serviceumgebungen",
    workOneText: "Entwicklung und Optimierung von Android- und Node.js-Erfahrungen für Roboterplattformen in Retail, Luftfahrt, Hotellerie und Servicebereichen.",
    workTwoTag: "Vernetzte Geräte",
    workTwoTitle: "ESP32 Smart-Device-Integration",
    workTwoText: "Aufbau von Hardware-Software-Kommunikation für IoT-Systeme, inklusive Backend-Authentifizierung mit Google API Services und Apple Sign-In.",
    workThreeTag: "Security & Research",
    workThreeTitle: "Proof-of-Concepts für Firmware- und Netzwerkanalyse",
    workThreeText: "Einsatz von Wireshark und Nmap zur Protokollanalyse, Unterstützung von Reverse-Engineering und Validierung technischer Proof-of-Concept-Programme.",
    experienceEyebrow: "Erfahrung",
    experienceTitle: "Gewachsen durch Kundenprojekte, Robotikteams und Integrationsarbeit.",
    expOneTitle: "Senior Robotics Engineer · Action to Action Robotics",
    expOneText: "Robotik-Softwareentwicklung mit Java, Kotlin, Android Studio, Retrofit, Node.js, MongoDB, ROS, Linux, Wireshark, API-Testtools und Git. Arbeit an Kundenlösungen für Abu Dhabi Police, Sharjah Government Land Department, DNV und Emirates National Schools.",
    expTwoTitle: "Technical Engineer · MAXimuz Technology",
    expTwoText: "Unterstützung bei Robotik- und Embedded-System-Integration, Portierung funktionaler Testprogramme zwischen Hardwarevarianten, Validierung von Bugfixes und Verbesserung von API-Code- und Funktionsabdeckung vor Releases.",
    expThreeTitle: "Robotics Engineer · Robo Barista",
    expThreeText: "Integrationstests für robotische Kaffeemaschinen, Pflege technischer Dokumentation und Entwicklung von Android-Anwendungen für Monitoring und Integration eingebetteter Systeme.",
    expFourTitle: "Integration Engineer · German Cyber-Systems",
    expFourText: "Freelance-Integrationsarbeit mit ESP32-Geräten, Backend-Services, sicheren Login-Flows, API-Integration, Systemtests, Debugging und Validierung.",
    expFiveTitle: "Cyber Security Engineer Intern · German Cyber-Systems",
    expFiveText: "Entwurf des Nordic-Home-Prototyps in Figma, Erstellung von Lernmaterial zu Verschlüsselung mit PGP und VeraCrypt, Entwicklung von React-Anwendungen und Koordination technischer Aufgaben als Senior Technical Lead.",
    expSixTitle: "Robotics Engineer Intern · Action to Action Robotics",
    expSixText: "Entwicklung von Android-Anwendungen für Robotersteuerung, Verbesserung von UI-Erlebnissen, Unterstützung von Roboter-Deployments und Erhalt eines Vollzeitangebots nach dem Praktikum.",
    educationEyebrow: "Ausbildung",
    educationTitle: "Cybersecurity-Grundlage mit praktischer Engineering-Erfahrung.",
    educationText: "Bachelor in Cybersecurity an der Paris American International University mit Schwerpunkt Cybersecurity und Ethical Hacking. High-School-Diplom der De La Salle University.",
    certificationsTitle: "Zertifizierungen",
    certImageHelp: "Zertifizierungsbilder: Fügen Sie Badge-Bildlinks in die Bildfelder in index.html ein.",
    languagesTitle: "Sprachen",
    languagesText: "Englisch, Filipino, Arabisch C1, Deutsch A1, Spanisch A2",
    contactEyebrow: "Kontakt",
    contactTitle: "Lassen Sie uns Systeme bauen, die in der realen Welt funktionieren.",
    contactText: "Verfügbar in Dubai, Vereinigte Arabische Emirate, für Integration, Robotik, Embedded Systems und Software-Rollen.",
    formNameLabel: "Name",
    formEmailLabel: "E-Mail",
    formMessageLabel: "Projekt / Nachricht",
    formButton: "Sichere Anfrage senden",
    formSuccess: "Nachricht gesendet! Wir melden uns bald.",
    footerText: "Integration Engineer · Dubai, VAE",
  },
  ar: {
    label: "العربية",
    flag: "flag-ar",
    lang: "ar",
    dir: "rtl",
    navSkills: "المهارات",
    navSnapshots: "لقطات العمل",
    navExperience: "الخبرة",
    navWork: "الأعمال",
    navTools: "الأدوات",
    navContact: "التواصل",
    heroEyebrow: "مهندسة تكامل · روبوتات · أنظمة مدمجة",
    heroTitle: "أبني أنظمة لطيفة وموثوقة للروبوتات والتطبيقات والأجهزة المتصلة.",
    heroSummary: "أنا كيرستن أومالي، مهندسة تكامل في دبي، لدي خبرة تقارب السنتين في تكامل الروبوتات، تطوير أندرويد، الأنظمة المدمجة، اختبار واجهات API، بيئات لينكس، والهندسة المرتبطة بالأمن السيبراني.",
    emailButton: "راسلني",
    imageGuideTitle: "مكان الصورة",
    imageGuideText: "ضعي هنا صورة لمساحة روبوتات، نموذج ESP32، شاشة أندرويد للتحكم بالروبوت، أو لوحة تكامل.",
    experiencePinTitle: "خبرة سنتين",
    experiencePinText: "روبوتات، تكامل، وأنظمة آمنة",
    statRoboticsTitle: "الروبوتات",
    statRoboticsText: "تطبيقات أندرويد، حساسات، ROS، ونشر منصات روبوتية",
    statIntegrationTitle: "التكامل",
    statIntegrationText: "واجهات REST API، اتصال Backend، والتحقق من الاختبارات",
    statSecurityTitle: "الأمن",
    statSecurityText: "Wireshark، Nmap، PGP، VeraCrypt، وتحليل البروتوكولات",
    skillsEyebrow: "النطاق التقني",
    skillsTitle: "خبرة عملية في البرمجيات والعتاد والأنظمة الآمنة.",
    skillProgrammingTitle: "البرمجة",
    skillProgrammingText: "C/C++، Java، Kotlin، React، SQL، Python، JavaScript، Bash، PowerShell",
    skillRoboticsTitle: "الروبوتات والأنظمة المدمجة",
    skillRoboticsText: "ROS، ESP32، Android OS، تكامل الحساسات، النمذجة الروبوتية، واتصال العتاد بالبرمجيات",
    skillMobileTitle: "الموبايل والـ Backend",
    skillMobileText: "Android Studio، REST APIs، Retrofit، OkHttp، Node.js، Express.js، MongoDB، Strapi",
    skillTestingTitle: "الاختبار والتحليل",
    skillTestingText: "Linux، Ubuntu، Git، Postman، Wireshark، Nmap، تحليل البروتوكولات، تحليل السجلات، وإصلاح الأخطاء",
    toolsEyebrow: "لقطات من العمل",
    toolsTitle: "نظرة بسيطة على نوع العمل الذي أحب القيام به.",
    toolAwsTitle: "ربط Backend وواجهات API",
    toolAwsText: "أحب جعل التطبيقات والأجهزة وخدمات Backend تتواصل بوضوح، خصوصا عندما تكون المصادقة وتدفق البيانات مهمة.",
    toolCodexTitle: "واجهات Android والروبوتات",
    toolCodexText: "أستمتع ببناء واجهات تجعل أنظمة الروبوتات أسهل في المراقبة والاختبار والاستخدام.",
    toolAiTitle: "حل المشاكل بعين أمنية",
    toolAiText: "أستخدم السجلات وفحص البروتوكولات وWireshark وNmap والاختبار الدقيق لفهم ما يحدث داخل النظام.",
    toolRoboticsTitle: "الروبوتات والأنظمة المدمجة",
    toolRoboticsText: "أحب الجانب العملي: الحساسات وESP32 وROS وLinux والتواصل بين العتاد والبرمجيات.",
    securityEyebrow: "تركيز الأمن السيبراني",
    securityTitle: "هندسة تهتم بالأمان في الأنظمة والشبكات وتدفقات التطبيقات.",
    securityOneTitle: "تحليل الشبكات والبروتوكولات",
    securityOneText: "خبرة باستخدام Wireshark وNmap وفحص البروتوكولات وتحليل السجلات لفهم سلوك الأنظمة وحل المشاكل.",
    securityTwoTitle: "تدفقات تطبيق آمنة",
    securityTwoText: "خبرة في المصادقة وخدمات Google API وApple Sign-In واختبار API وأنماط اتصال Backend أكثر أمانا.",
    securityThreeTitle: "أساس أكاديمي في الأمن السيبراني",
    securityThreeText: "بكالوريوس في الأمن السيبراني مع تركيز على الاختراق الأخلاقي ومفاهيم التشفير وPGP وVeraCrypt والتفكير الآمن.",
    workEyebrow: "أعمال مختارة",
    workTitle: "مشاريع يلتقي فيها البرمجيات بالعالم الفعلي.",
    workOneTag: "نشر الروبوتات",
    workOneTitle: "تطبيقات منصات روبوتية لبيئات الخدمة",
    workOneText: "طورت وحسنت تجارب Android وNode.js لمنصات روبوتية مستخدمة في التجزئة والطيران والفنادق وقطاعات الخدمات.",
    workTwoTag: "أجهزة متصلة",
    workTwoTitle: "تكامل أجهزة ESP32 الذكية",
    workTwoText: "بنيت تدفقات اتصال بين العتاد والبرمجيات لأنظمة IoT، بما في ذلك مصادقة Backend باستخدام خدمات Google API وApple Sign-In.",
    workThreeTag: "الأمن والبحث",
    workThreeTitle: "نماذج إثبات مفهوم لتحليل Firmware والشبكات",
    workThreeText: "استخدمت Wireshark وNmap لتحليل البروتوكولات، دعم أعمال الهندسة العكسية، والتحقق من برامج إثبات المفهوم التقنية.",
    experienceEyebrow: "الخبرة",
    experienceTitle: "خبرة تكونت من مشاريع عملاء وفرق روبوتات وأعمال تكامل.",
    expOneTitle: "Senior Robotics Engineer · Action to Action Robotics",
    expOneText: "تطوير برمجيات روبوتية باستخدام Java وKotlin وAndroid Studio وRetrofit وNode.js وMongoDB وROS وLinux وWireshark وأدوات اختبار API وGit. عملت على حلول لعملاء مثل Abu Dhabi Police وSharjah Government Land Department وDNV وEmirates National Schools.",
    expTwoTitle: "Technical Engineer · MAXimuz Technology",
    expTwoText: "دعمت تكامل الروبوتات والأنظمة المدمجة، ونقلت برامج اختبار وظيفية بين نسخ مختلفة من العتاد، وتحققت من إصلاحات الأخطاء، وساعدت في تحسين تغطية كود وخصائص API قبل الإصدارات.",
    expThreeTitle: "Robotics Engineer · Robo Barista",
    expThreeText: "أجريت اختبارات تكامل لأنظمة ماكينة قهوة روبوتية، وحافظت على الوثائق التشغيلية، وطورت تطبيقات Android للمراقبة والتكامل مع الأنظمة المدمجة.",
    expFourTitle: "Integration Engineer · German Cyber-Systems",
    expFourText: "عمل حر في تكامل أجهزة ESP32، خدمات Backend، تدفقات تسجيل دخول آمنة، تكامل API، اختبار الأنظمة، التصحيح، والتحقق.",
    expFiveTitle: "Cyber Security Engineer Intern · German Cyber-Systems",
    expFiveText: "صممت نموذج Nordic Home في Figma، وأنشأت محتوى تعليمي عن التشفير باستخدام PGP وVeraCrypt، وطورت تطبيقات React، ونسقت المهام التقنية كقائدة تقنية.",
    expSixTitle: "Robotics Engineer Intern · Action to Action Robotics",
    expSixText: "بنيت تطبيقات Android للتحكم بالروبوتات، وحسنت تجربة الواجهة، ودعمت نشر الروبوتات، وحصلت على عرض عمل بدوام كامل بعد التدريب.",
    educationEyebrow: "التعليم",
    educationTitle: "أساس في الأمن السيبراني مع ممارسة هندسية.",
    educationText: "بكالوريوس في الأمن السيبراني من Paris American International University مع تخصص في الأمن السيبراني والاختراق الأخلاقي. شهادة ثانوية من De La Salle University.",
    certificationsTitle: "الشهادات",
    certImageHelp: "صور الشهادات: ضعي روابط صور البادجات في خانات الصور داخل index.html.",
    languagesTitle: "اللغات",
    languagesText: "الإنجليزية، الفلبينية، العربية C1، الألمانية A1، الإسبانية A2",
    contactEyebrow: "التواصل",
    contactTitle: "لنبن أنظمة تعمل فعلا في العالم الحقيقي.",
    contactText: "متاحة في دبي، الإمارات العربية المتحدة، لأدوار التكامل والروبوتات والأنظمة المدمجة والبرمجيات.",
    formNameLabel: "الاسم",
    formEmailLabel: "البريد الإلكتروني",
    formMessageLabel: "المشروع / الرسالة",
    formButton: "إرسال طلب آمن",
    formSuccess: "تم إرسال الرسالة! سنتواصل معك قريبا.",
    footerText: "مهندسة تكامل · دبي، الإمارات",
  },
};

function applyLanguage(languageCode) {
  const language = translations[languageCode];
  document.documentElement.lang = language.lang;
  document.documentElement.dir = language.dir;

  translatable.forEach((element) => {
    const key = element.dataset.i18n;
    if (language[key]) {
      element.textContent = language[key];
    }
  });

  if (languageToggle) {
    languageToggle.innerHTML = `<span class="flag-icon ${language.flag}" aria-hidden="true"></span><span>${language.label}</span>`;
    languageToggle.setAttribute("aria-label", `Current language: ${language.label}. Press to switch language.`);
  }
}

if (year) {
  year.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "Light" : "Dark";
  }

  if (themeToggle) {
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
    applyLanguage(languages[currentLanguageIndex]);
    if (window.setAiAgentLanguage) {
      window.setAiAgentLanguage(languages[currentLanguageIndex]);
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const language = translations[languages[currentLanguageIndex]];
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (contactStatus) {
      contactStatus.textContent = "Sending...";
      contactStatus.style.color = "var(--color-text-muted)";
    }

    try {
      const response = await fetch("/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (contactStatus) {
        if (data.success) {
          contactStatus.textContent = language.formSuccess;
          contactStatus.style.color = "var(--color-success)";
          contactForm.reset();
        } else {
          contactStatus.textContent = `Error: ${data.error}`;
          contactStatus.style.color = "var(--color-error)";
        }
      }
    } catch (error) {
      if (contactStatus) {
        contactStatus.textContent = "Failed to send. Please try again.";
        contactStatus.style.color = "var(--color-error)";
      }
    }
  });
}

certBadges.forEach((badge) => {
  const imageUrl = badge.dataset.certImage?.trim();
  if (imageUrl) {
    badge.style.backgroundImage = `url("${imageUrl}")`;
    badge.classList.add("has-image");
  }
});

// Mouse parallax on hero image
const heroShell = document.querySelector(".hero-shell");
const heroImage = document.querySelector(".hero-visual img");

if (heroShell && heroImage) {
  heroShell.addEventListener("mousemove", (e) => {
    const rect = heroShell.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const moveX = (x - 0.5) * 30;
    const moveY = (y - 0.5) * 15;
    heroImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    heroImage.style.transition = "transform 80ms ease-out";
  });

  heroShell.addEventListener("mouseleave", () => {
    heroImage.style.transform = "translate(0, 0) scale(1)";
    heroImage.style.transition = "transform 500ms ease";
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  animatedElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    revealObserver.observe(element);
  });
} else {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
}

applyLanguage(languages[currentLanguageIndex]);
applyTheme(currentTheme);
if (window.setAiAgentLanguage) {
  window.setAiAgentLanguage(languages[currentLanguageIndex]);
}

// Pop up photo labels automatically as cards slide into view.
const photoCards = document.querySelectorAll(".photo-slide-card");
if ("IntersectionObserver" in window) {
  const photoLabelObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting && entry.intersectionRatio >= 0.65);
    });
  }, { threshold: [0, 0.65] });
  photoCards.forEach((card) => photoLabelObserver.observe(card));
} else {
  photoCards.forEach((card) => card.classList.add("is-in-view"));
}

// Hero slideshow: change images every three seconds.
document.querySelectorAll("[data-slideshow]").forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll(":scope > img")];
  let current = 0;
  let timer;

  const showSlide = (index) => {
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", String(i !== current));
    });
  };
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!document.hidden && slides.length > 1) {
      timer = window.setInterval(() => showSlide((current + 1) % slides.length), 3000);
    }
  };
  document.addEventListener("visibilitychange", start);
  start();
});

// Hide header on scroll down, show on scroll up (mobile)
(function() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const cur = window.scrollY;
    if (cur > lastScroll && cur > 80) {
      header.classList.add("header-hidden");
    } else if (cur < lastScroll) {
      header.classList.remove("header-hidden");
    }
    lastScroll = cur;
  }, { passive: true });
})();
