(function(){
  const data = {
    name: "Kirsten Umali",
    title: "Integration Engineer",
    location: "Dubai, UAE",
    about: "Integration Engineer working across robotics, embedded systems, Android apps, APIs, and cybersecurity.",
    skills: [
      "Programming: C/C++, Java, Kotlin, React, SQL, Python, JavaScript, Bash, PowerShell",
      "Robotics & Embedded: ROS, ESP32, Android OS, sensor integration, robotics prototyping",
      "Mobile & Backend: Android Studio, REST APIs, Retrofit, Node.js, Express.js, MongoDB",
      "Testing & Analysis: Linux, Wireshark, Nmap, protocol analysis, log analysis, Git, Postman"
    ],
    experience: [
      "2025: Robotics Engineer Intern at Action to Action Robotics: built Android apps for robot control, earned full-time offer",
      "2025: Technical Engineer at MAXimuz Technology: robotics integration, test automation, API improvements",
      "2025: Robotics Engineer at Robo Barista: integration testing for robotic coffee machines, Android monitoring apps",
      "2026: Senior Robotics Engineer at Action to Action Robotics: Java, Kotlin, ROS, Wireshark, client solutions for Abu Dhabi Police, DNV, Emirates Schools",
      "2026: Integration Engineer at German Cyber-Systems (freelance): ESP32, backend services, secure sign-in, API testing",
      "2026: Cyber Security Engineer Intern at German Cyber-Systems: Figma prototyping, encryption education, React dev"
    ],
    work: [
      "Robot platform apps for service environments: Android and Node.js for retail, aviation, hotel robots",
      "ESP32 smart device integration: IoT hardware-software communication with Google API and Apple Sign-In",
      "Firmware and network analysis: Wireshark and Nmap for protocol analysis and proof-of-concepts"
    ],
    certifications: ["IBM Core 1", "AWS AI Practitioner", "AWS SAA-C03", "IBM Core 2", "Google Cybersecurity", "Meta Android Dev"],
    education: "Bachelors in Cybersecurity at Paris American International University",
    languages: "English, Filipino, Arabic C1, German A1, Spanish A2",
    links: { github: "https://github.com/Kirstenumali", linkedin: "https://linkedin.com/in/kirstenumali" }
  };

  let currentLang = "en";

  const translations = {
    en: {
      header: "Kirsten",
      placeholder: "Ask something...",
      send: "Send",
      greeting: "Hey there! I'm Kirsten. Ask me about my skills, experience, work, certifications, or anything else you're curious about!",
      sent: "Got it! Your message has been sent to Kirsten. She'll get back to you soon.\n\nAnything else I can help with?",
      sendFail: "Hmm, I couldn't send the message right now. You can also use the contact form on the page to reach out!\n\nAnything else you'd like to know?",
      noMemory: "We haven't talked much yet! Ask me about my skills, experience, or anything you're curious about.",
      recap: "Here's what we've discussed: ",
      recapEnd: ". What else would you like to know?",
      replies: {
        hi: ["Hey there!", "Hello!", "Hi! How can I help?"],
        hello: ["Hey there!", "Hello!", "Hi! How can I help?"],
        hey: ["Hey!", "Hello there!", "Hi!"],
        who: ["I'm Kirsten Umali, an Integration Engineer based in Dubai. I work across robotics, embedded systems, Android apps, APIs, and cybersecurity."],
        what: ["I build robot systems, Android apps, and secure backend services. A pretty fun mix!"],
        skills: ["I work with C/C++, Java, Kotlin, Python, ROS, ESP32, Android, Node.js, and more! Want me to list specific areas?"],
        experience: ["I've worked across six awesome roles since 2025 in robotics, integration, and cybersecurity. Want details on a specific one?"],
        work: ["I've done robot platform apps, ESP32 integrations, and network security analysis. Interested in any project?"],
        certifications: ["I hold AWS SAA-C03, Google Cybersecurity, Meta Android Dev, and others! Want to hear about my education too?"],
        education: ["Bachelors in Cybersecurity from Paris American International University. Plus a High School Diploma from De La Salle."],
        languages: ["English, Filipino, Arabic C1, German A1, Spanish A2. Pretty multilingual!"],
        location: ["Based in Dubai, UAE. Open to exciting roles in robotics, integration, and cybersecurity!"],
        contact: ["Use the contact form on the site or reach out on LinkedIn. I usually reply within a few hours!"],
        github: ["Check out my repos at github.com/Kirstenumali. Feel free to explore!"],
        linkedin: ["Let's connect at linkedin.com/in/kirstenumali. I'd love to connect!"],
        website: ["This site runs on Express behind nginx with a Telegram contact form. Source is on GitHub!"],
        ai: ["Yes, I'm an AI assistant that knows all about Kirsten's work. Ask me anything or say 'message' to leave a note!"],
        message: ["Sure, just type your message and I'll send it to her. What would you like to say?"],
        team: ["Sure! You can reach me through the contact form below."],
        professional: ["Absolutely! I bring professionalism and dedication to every project. Would you like to hear about my experience?"],
        default: [
          "Try asking about my skills, experience, or work. What interests you?",
          "I'm not sure about that one! Ask about my skills, experience, or certifications instead.",
          "If you'd like, feel free to reach out through the contact form on the page."
        ],
        fallback: [
          "I can tell you about my skills, experience, work, and certifications. What would you like to explore?",
          "Ask me about my skills, experience, or contact info. Or feel free to use the contact form to reach out directly!"
        ]
      },
      followUps: {
        hi: "What would you like to know about me?",
        who: "Curious about my skills or experience?",
        what: "Want to hear about the technologies I use?",
        skills: "Any specific area you're interested in?",
        experience: "Want to hear about my current role or earlier work?",
        work: "Any project you'd like more details on?",
        certifications: "Want to see my education too?",
        education: "Would you like to see my certifications as well?",
        languages: "Want to know where I'm based?",
        location: "Want to reach out? I can help with that!",
        contact: "Anything else before you reach out?",
        github: "Want to check out my LinkedIn too?",
        linkedin: "Want to see my GitHub as well?",
        website: "Anything else you're curious about?",
        ai: "What would you like to know?",
        message: "Go ahead, I'm listening!",
        team: "The contact form is right there on the page.",
        professional: "I'm sure we'd make a great team!"
      }
    },
    es: {
      header: "Kirsten",
      placeholder: "Pregunta algo...",
      send: "Enviar",
      greeting: "¡Hola! Soy Kirsten. Pregúntame sobre mis habilidades, experiencia, proyectos, certificaciones o lo que te interese.",
      sent: "¡Recibido! Tu mensaje ha sido enviado a Kirsten. Te responderá pronto.\n\n¿Algo más en lo que pueda ayudar?",
      sendFail: "No pude enviar el mensaje ahora. También puedes usar el formulario de contacto en la página.\n\n¿Quieres saber algo más?",
      noMemory: "Todavía no hemos hablado mucho. Pregúntame sobre mis habilidades, experiencia o lo que te interese.",
      recap: "Esto es lo que hemos hablado: ",
      recapEnd: ". ¿Qué más te gustaría saber?",
      replies: {
        hi: ["¡Hola!", "¡Hey!", "¡Hola! ¿En qué puedo ayudarte?"],
        hello: ["¡Hola!", "¡Hey!", "¡Hola! ¿En qué puedo ayudarte?"],
        hey: ["¡Hey!", "¡Hola!", "¡Hola! ¿Cómo estás?"],
        who: ["Soy Kirsten Umali, Ingeniera de Integración en Dubái. Trabajo en robótica, sistemas embebidos, apps Android, APIs y ciberseguridad."],
        what: ["Construyo sistemas robóticos, apps Android y servicios backend seguros. ¡Una mezcla divertida!"],
        skills: ["Trabajo con C/C++, Java, Kotlin, Python, ROS, ESP32, Android, Node.js y más. ¿Quieres que detalle áreas específicas?"],
        experience: ["He trabajado en seis roles increíbles desde 2025 en robótica, integración y ciberseguridad. ¿Quieres detalles de alguno?"],
        work: ["He hecho apps para plataformas robóticas, integraciones ESP32 y análisis de seguridad en redes. ¿Te interesa algún proyecto?"],
        certifications: ["Tengo AWS SAA-C03, Google Cybersecurity, Meta Android Dev y más. ¿Quieres oír sobre mi educación también?"],
        education: ["Licenciatura en Ciberseguridad de Paris American International University. Más un diploma de secundaria de De La Salle."],
        languages: ["Inglés, Filipino, Árabe C1, Alemán A1, Español A2. ¡Bastante multilingüe!"],
        location: ["Con sede en Dubái, EAU. Abierta a roles emocionantes en robótica, integración y ciberseguridad."],
        contact: ["Usa el formulario de contacto en el sitio o escríbeme en LinkedIn. ¡Suelo responder en unas horas!"],
        github: ["Mira mis repos en github.com/Kirstenumali. ¡Siéntete libre de explorar!"],
        linkedin: ["Conectemos en linkedin.com/in/kirstenumali. ¡Me encantaría conectar!"],
        website: ["Este sitio funciona con Express detrás de nginx con un formulario de contacto vía Telegram. ¡El código está en GitHub!"],
        ai: ["Sí, soy un asistente AI que sabe todo sobre el trabajo de Kirsten. Pregúntame cualquier cosa o di 'mensaje' para dejar una nota."],
        message: ["Claro, escribe tu mensaje y se lo enviaré. ¿Qué te gustaría decir?"],
        team: ["¡Claro! Puedes contactarme a través del formulario abajo."],
        professional: ["¡Por supuesto! Soy profesional y dedicada a cada proyecto. ¿Te gustaría conocer mi experiencia?"],
        default: [
          "Pregunta sobre mis habilidades, experiencia o proyectos. ¿Qué te interesa?",
          "No estoy segura de eso. Pregunta sobre mis habilidades, experiencia o certificaciones.",
          "Si quieres, puedes contactarme a través del formulario en la página."
        ],
        fallback: [
          "Puedo contarte sobre mis habilidades, experiencia, proyectos y certificaciones. ¿Qué te gustaría explorar?",
          "Pregúntame sobre mis habilidades, experiencia o contacto. O usa el formulario para escribirme directamente."
        ]
      },
      followUps: {
        hi: "¿Qué te gustaría saber de mí?",
        who: "¿Te interesan mis habilidades o experiencia?",
        what: "¿Quieres oír sobre las tecnologías que uso?",
        skills: "¿Alguna área específica que te interese?",
        experience: "¿Quieres oír sobre mi rol actual o trabajos anteriores?",
        work: "¿Algún proyecto del que quieras más detalles?",
        certifications: "¿Quieres ver mi educación también?",
        education: "¿Te gustaría ver mis certificaciones también?",
        languages: "¿Quieres saber dónde tengo mi base?",
        location: "¿Quieres contactarme? ¡Puedo ayudarte con eso!",
        contact: "¿Algo más antes de contactar?",
        github: "¿Quieres ver mi LinkedIn también?",
        linkedin: "¿Quieres ver mi GitHub también?",
        website: "¿Algo más que te cause curiosidad?",
        ai: "¿Qué te gustaría saber?",
        message: "Adelante, te escucho.",
        team: "El formulario de contacto está justo ahí en la página.",
        professional: "Estoy segura de que haríamos un gran equipo."
      }
    },
    de: {
      header: "Kirsten",
      placeholder: "Frag etwas...",
      send: "Senden",
      greeting: "Hallo! Ich bin Kirsten. Frag mich zu meinen Fähigkeiten, Erfahrungen, Projekten, Zertifikaten oder allem anderen, was dich interessiert!",
      sent: "Verstanden! Deine Nachricht wurde an Kirsten gesendet. Sie wird sich bald melden.\n\nKann ich sonst noch helfen?",
      sendFail: "Ich konnte die Nachricht gerade nicht senden. Du kannst auch das Kontaktformular auf der Seite nutzen!\n\nMöchtest du noch etwas wissen?",
      noMemory: "Wir haben noch nicht viel geredet! Frag mich zu meinen Fähigkeiten, Erfahrungen oder allem, was dich interessiert.",
      recap: "Hier ist, worüber wir gesprochen haben: ",
      recapEnd: ". Was möchtest du noch wissen?",
      replies: {
        hi: ["Hallo!", "Hey!", "Hi! Wie kann ich helfen?"],
        hello: ["Hallo!", "Hey!", "Hi! Wie kann ich helfen?"],
        hey: ["Hey!", "Hallo!", "Hi!"],
        who: ["Ich bin Kirsten Umali, Integrationsingenieurin in Dubai. Ich arbeite mit Robotik, eingebetteten Systemen, Android-Apps, APIs und Cybersicherheit."],
        what: ["Ich baue Robotersysteme, Android-Apps und sichere Backend-Dienste. Eine ziemlich coole Mischung!"],
        skills: ["Ich arbeite mit C/C++, Java, Kotlin, Python, ROS, ESP32, Android, Node.js und mehr. Soll ich bestimmte Bereiche auflisten?"],
        experience: ["Ich habe seit 2025 in sechs tollen Rollen in Robotik, Integration und Cybersicherheit gearbeitet. Möchtest du Details zu einer bestimmten?"],
        work: ["Ich habe Roboterplattform-Apps, ESP32-Integrationen und Netzwerksicherheitsanalysen gemacht. Interessiert an einem Projekt?"],
        certifications: ["Ich besitze AWS SAA-C03, Google Cybersecurity, Meta Android Dev und andere. Möchtest du auch etwas über meine Ausbildung hören?"],
        education: ["Bachelor in Cybersicherheit von der Paris American International University. Plus ein High-School-Diplom von De La Salle."],
        languages: ["Englisch, Filipino, Arabisch C1, Deutsch A1, Spanisch A2. Ziemlich mehrsprachig!"],
        location: ["Basiert in Dubai, VAE. Offen für spannende Rollen in Robotik, Integration und Cybersicherheit."],
        contact: ["Nutze das Kontaktformular auf der Seite oder kontaktiere mich auf LinkedIn. Ich antworte normalerweise innerhalb weniger Stunden!"],
        github: ["Schau dir meine Repos auf github.com/Kirstenumali an. Stöbere ruhig!"],
        linkedin: ["Vernetzen wir uns auf linkedin.com/in/kirstenumali. Ich würde mich freuen!"],
        website: ["Diese Seite läuft auf Express hinter nginx mit einem Telegram-Kontaktformular. Der Quellcode ist auf GitHub!"],
        ai: ["Ja, ich bin ein KI-Assistent, der alles über Kirstens Arbeit weiß. Frag mich alles oder sag 'Nachricht', um eine Notiz zu hinterlassen!"],
        message: ["Klar, schreib einfach deine Nachricht und ich leite sie weiter. Was möchtest du sagen?"],
        team: ["Klar! Du kannst mich über das Kontaktformular unten erreichen."],
        professional: ["Absolut! Ich bin professionell und engagiert bei jedem Projekt. Möchtest du mehr über meine Erfahrung hören?"],
        default: [
          "Frag nach meinen Fähigkeiten, Erfahrungen oder Projekten. Was interessiert dich?",
          "Da bin ich mir nicht sicher! Frag nach meinen Fähigkeiten, Erfahrungen oder Zertifikaten.",
          "Wenn du möchtest, kannst du mich über das Kontaktformular auf der Seite erreichen."
        ],
        fallback: [
          "Ich kann dir von meinen Fähigkeiten, Erfahrungen, Projekten und Zertifikaten erzählen. Was möchtest du erkunden?",
          "Frag mich nach meinen Fähigkeiten, Erfahrungen oder Kontaktinfo. Oder nutze das Kontaktformular, um mir direkt zu schreiben."
        ]
      },
      followUps: {
        hi: "Was möchtest du über mich wissen?",
        who: "Interessierst du dich für meine Fähigkeiten oder Erfahrungen?",
        what: "Möchtest du hören, welche Technologien ich nutze?",
        skills: "Gibt es einen bestimmten Bereich, der dich interessiert?",
        experience: "Möchtest du mehr über meine aktuelle Rolle oder frühere Erfahrungen hören?",
        work: "Interessiert dich ein bestimmtes Projekt? Ich kann mehr Details teilen!",
        certifications: "Möchtest du auch meine Ausbildung sehen?",
        education: "Möchtest du auch meine Zertifikate sehen?",
        languages: "Möchtest du wissen, wo ich lebe?",
        location: "Möchtest du Kontakt aufnehmen? Ich kann dabei helfen!",
        contact: "Noch etwas, bevor du Kontakt aufnimmst?",
        github: "Möchtest du auch mein LinkedIn sehen?",
        linkedin: "Möchtest du auch mein GitHub sehen?",
        website: "Gibt es noch etwas, das dich interessiert?",
        ai: "Was möchtest du wissen?",
        message: "Los geht's, ich höre zu.",
        team: "Das Kontaktformular ist direkt auf der Seite.",
        professional: "Ich bin sicher, wir wären ein großartiges Team!"
      }
    },
    ar: {
      header: "كيرستن",
      placeholder: "اسأل شيئاً...",
      send: "إرسال",
      greeting: "مرحباً! أنا كيرستن. اسألني عن مهاراتي، خبراتي، مشاريعي، شهاداتي، أو أي شيء تريد معرفته!",
      sent: "تم الاستلام! تم إرسال رسالتك إلى كيرستن. ستعود إليك قريباً.\n\nهل هناك أي شيء آخر يمكنني المساعدة به؟",
      sendFail: "لم أتمكن من إرسال الرسالة الآن. يمكنك أيضاً استخدام نموذج الاتصال في الصفحة للتواصل!\n\nهل تريد معرفة أي شيء آخر؟",
      noMemory: "لم نتحدث كثيراً بعد! اسألني عن مهاراتي، خبراتي، أو أي شيء تريد معرفته.",
      recap: "إليك ما ناقشناه: ",
      recapEnd: ". ما الذي تريد معرفته أيضاً؟",
      replies: {
        hi: ["مرحباً!", "أهلاً!", "مرحباً! كيف يمكنني المساعدة؟"],
        hello: ["مرحباً!", "أهلاً!", "مرحباً! كيف يمكنني المساعدة؟"],
        hey: ["أهلاً!", "مرحباً!", "مرحباً!"],
        who: ["أنا كيرستن أومالي، مهندسة تكامل في دبي. أعمل في مجالات الروبوتات، الأنظمة المدمجة، تطبيقات أندرويد، واجهات API، والأمن السيبراني."],
        what: ["أبني أنظمة روبوتية، تطبيقات أندرويد، وخدمات خلفية آمنة. مزيج ممتع!"],
        skills: ["أعمل مع C/C++، Java، Kotlin، Python، ROS، ESP32، Android، Node.js، والمزيد. هل تريد مني سرد مجالات محددة؟"],
        experience: ["عملت في ستة أدوار رائعة منذ 2025 في الروبوتات، التكامل، والأمن السيبراني. هل تريد تفاصيل عن دور معين؟"],
        work: ["قمت بتطبيقات منصات روبوتية، تكاملات ESP32، وتحليلات أمن الشبكات. هل يهمك أي مشروع؟"],
        certifications: ["لدي شهادات AWS SAA-C03، Google Cybersecurity، Meta Android Dev، وغيرها. هل تريد سماع مؤهلاتي التعليمية أيضاً؟"],
        education: ["بكالوريوس في الأمن السيبراني من جامعة باريس الأمريكية الدولية. بالإضافة إلى شهادة الثانوية من دي لا سال."],
        languages: ["الإنجليزية، الفلبينية، العربية C1، الألمانية A1، الإسبانية A2. متعددة اللغات!"],
        location: ["مقرها دبي، الإمارات. مفتوحة للأدوار المثيرة في الروبوتات، التكامل، والأمن السيبراني."],
        contact: ["استخدم نموذج الاتصال على الموقع أو تواصل معي على LinkedIn. عادة أرد خلال بضع ساعات!"],
        github: ["اطلع على مستودعاتي على github.com/Kirstenumali. لا تتردد في الاستكشاف!"],
        linkedin: ["لنتواصل على linkedin.com/in/kirstenumali. يسعدني التواصل!"],
        website: ["هذا الموقع يعمل على Express خلف nginx مع نموذج اتصال عبر Telegram. المصدر على GitHub!"],
        ai: ["نعم، أنا مساعد ذكي أعرف كل شيء عن عمل كيرستن. اسألني أي شيء أو قل 'رسالة' لترك ملاحظة!"],
        message: ["بالتأكيد، فقط اكتب رسالتك وسأرسلها لها. ماذا تريد أن تقول؟"],
        team: ["بالتأكيد! يمكنك التواصل معي عبر نموذج الاتصال بالأسفل."],
        professional: ["بالتأكيد! أنا محترفة ومخلصة في كل مشروع. هل تود سماع خبراتي؟"],
        default: [
          "حاول أن تسأل عن مهاراتي، خبراتي، أو مشاريعي. ما الذي يهمك؟",
          "لست متأكدة من ذلك! اسأل عن مهاراتي، خبراتي، أو شهاداتي بدلاً من ذلك.",
          "إذا أردت، يمكنك التواصل معي عبر نموذج الاتصال في الصفحة."
        ],
        fallback: [
          "يمكنني إخبارك عن مهاراتي، خبراتي، مشاريعي، وشهاداتي. ما الذي تود استكشافه؟",
          "اسألني عن مهاراتي، خبراتي، أو معلومات الاتصال. أو استخدم نموذج الاتصال للتواصل معي مباشرة."
        ]
      },
      followUps: {
        hi: "ماذا تريد أن تعرف عني؟",
        who: "هل تهمك مهاراتي أو خبراتي؟",
        what: "هل تريد سماع التقنيات التي أستخدمها؟",
        skills: "هل هناك مجال معين يهمك؟",
        experience: "هل تريد سماع دوري الحالي أو أعمالي السابقة؟",
        work: "هل يهمك مشروع معين؟ يمكنني مشاركة المزيد من التفاصيل!",
        certifications: "هل تريد رؤية مؤهلاتي التعليمية أيضاً؟",
        education: "هل تود رؤية شهاداتي أيضاً؟",
        languages: "هل تريد معرفة مكان إقامتي؟",
        location: "هل تريد التواصل؟ يمكنني المساعدة في ذلك!",
        contact: "هل هناك أي شيء آخر قبل التواصل؟",
        github: "هل تريد رؤية LinkedIn الخاص بي أيضاً؟",
        linkedin: "هل تريد رؤية GitHub الخاص بي أيضاً؟",
        website: "هل هناك أي شيء آخر يثير فضولك؟",
        ai: "ماذا تريد أن تعرف؟",
        message: "تفضل، أنا أستمع.",
        team: "نموذج الاتصال موجود بالأسفل في الصفحة.",
        professional: "أنا متأكدة أننا سنكون فريقاً رائعاً!"
      }
    }
  };

  function getLang() { return currentLang; }

  function t(key) {
    const keys = key.split(".");
    let obj = translations[currentLang] || translations.en;
    for (const k of keys) {
      obj = obj[k];
      if (!obj) return key;
    }
    return obj;
  }

  function getReplies() { return t("replies"); }
  function getFollowUps() { return t("followUps"); }

  function matchIntent(text) {
    const t = text.toLowerCase();
    if (/\b(hi|hello|hey|howdy|hola|hallo|مرحبا|أهلا)\b/.test(t)) return "hi";
    if (/\b(who|about|are you|tell me about|quien|quién|wer|bist|من|عن)\b/.test(t)) return "who";
    if (/\b(what do you do|what are you|que haces|was machst|ماذا تفعل|qué)\b/.test(t)) return "what";
    if (/\b(skill|know|can you|technology|tech|program|code|language|stack|habilidad|tecnología|können|technologie|fähigkeit|مهارة|تقنية|تقدر|تعرف)\b/.test(t)) return "skills";
    if (/\b(experience|work(ed|ing)?|job|role|position|career|intern|company|employ|experiencia|trabajo|puesto|erfahrung|arbeit|stelle|خبرة|عمل|وظيفة|تدريب)\b/.test(t)) return "experience";
    if (/\b(project|built|build|develop|create|deploy|proyecto|construir|desarrollar|projekt|bauen|entwickeln|مشروع|بناء|تطوير)\b/.test(t) && !/\bexperience|erfahrung|خبرة\b/.test(t)) return "work";
    if (/\b(cert|certification|badge|credential|qualification|certificado|certificación|zertifikat|شهادة|مؤهل)\b/.test(t)) return "certifications";
    if (/\b(edu|study|school|university|college|degree|bachelor|learn|educación|estudio|universidad|bildung|studium|universität|تعليم|دراسة|جامعة)\b/.test(t)) return "education";
    if (/\b(lang|speak|spanish|arabic|german|filipino|english|idioma|hablar|alemán|árabe|sprache|sprechen|arabisch|لغة|تحدث|عربي|ألماني)\b/.test(t)) return "languages";
    if (/\b(live|location|based|dubai|uae|where|vivir|ubicación|dónde|wo|wohnen|standort|أين|أعيش|مكان|دبي|الإمارات)\b/.test(t)) return "location";
    if (/\b(contact|email|message|reach|get in touch|connect|contacto|correo|mensaje|kontakt|nachricht|erreichen|اتصال|بريد|رسالة|تواصل)\b/.test(t)) return "contact";
    if (/\b(git|github|repo|source|code|código|fuente|quelle|مصدر|كود)\b/.test(t)) return "github";
    if (/\b(linkedin|linked)\b/.test(t)) return "linkedin";
    if (/\b(site|website|portfolio|this|sitio|web|portfolio|website|seite|موقع|صفحة)\b/.test(t)) return "website";
    if (/\b(are you (an )?ai|are you (a )?bot|are you real|ai assistant|chatbot|eres un ai|eres un bot|bist du ein bot|ki assistent|هل أنت ذكاء اصطناعي|بوت|مساعد)\b/.test(t)) return "ai";
    if (/\b(message|tell her|tell him|send|leave a note|give a message|mensaje|decirle|enviar|nachricht|senden|schicken|رسالة|أرسل|أبلغ|قل لها)\b/.test(t)) return "message";
    if (/\b(professional|professionally|pro|profesional|professionell|محترف)\b/.test(t)) return "professional";
    if (/\b(team|join|hire|recruit|want you|need you|contratar|unir|equipo|einstellen|brauchen|توظيف|فريق|احتاج)\b/.test(t) && !/\b(skill|experience|work|project|proyect|erfahrung|خبرة|مشروع)\b/.test(t)) return "team";
    return null;
  }

  function getLastIntent() {
    const replies = getReplies();
    for (let i = memory.length - 1; i >= 0; i--) {
      if (memory[i].role === "assistant") {
        const m = memory[i].text.toLowerCase();
        if (m.includes("skill") || m.includes("habilidad") || m.includes("fähigkeit") || m.includes("مهارة")) return "skills";
        if (m.includes("experience") || m.includes("intern") || m.includes("engineer") || m.includes("erfahrung") || m.includes("خبرة")) return "experience";
        if (m.includes("project") || m.includes("work") || m.includes("build") || m.includes("projekt") || m.includes("مشروع")) return "work";
        if (m.includes("cert") || m.includes("certificación") || m.includes("zertifikat") || m.includes("شهادة")) return "certifications";
        if (m.includes("edu") || m.includes("study") || m.includes("university") || m.includes("bildung") || m.includes("تعليم")) return "education";
        if (m.includes("languag") || m.includes("speak") || m.includes("sprache") || m.includes("لغة")) return "languages";
        if (m.includes("locat") || m.includes("dubai") || m.includes("based") || m.includes("standort") || m.includes("مكان")) return "location";
        if (m.includes("contact") || m.includes("message") || m.includes("kontakt") || m.includes("اتصال")) return "contact";
      }
    }
    return null;
  }

  function getReply(text) {
    const replies = getReplies();
    const followUps = getFollowUps();
    const intent = matchIntent(text);
    const t = text.toLowerCase();
    const lang = translations[currentLang] || translations.en;

    if (!intent && /\b(more|details|elaborate|continue|go on|tell me more|expand|más|detalles|continuar|mehr|details|weitere|المزيد|تفاصيل|أكثر)\b/.test(t)) {
      const last = getLastIntent();
      if (last) {
        const r = replies[last];
        let reply = r[Math.floor(Math.random() * r.length)];
        const followUp = followUps[last];
        if (followUp) reply += " " + followUp;
        return reply;
      }
    }

    if (!intent && /\b(what (did|was) (i|we) (ask|talk|say)|remind me|recap|summary|qué pregunté|resumen|zusammenfassung|erinnern|ماذا سألت|تذكير|ملخص)\b/.test(t)) {
      if (memory.length <= 1) return lang.noMemory;
      const lastTopics = [...new Set(memory.slice(-6).map(m => m.role === "user" ? m.text : null).filter(Boolean))];
      return lang.recap + lastTopics.slice(-3).join(", ") + lang.recapEnd;
    }

    if (!intent) {
      const f = replies.fallback;
      return f[Math.floor(Math.random() * f.length)];
    }
    const r = replies[intent];
    let reply = r[Math.floor(Math.random() * r.length)];
    const followUp = followUps[intent];
    if (followUp) reply += " " + followUp;
    return reply;
  }

  const css = document.createElement("style");
  css.textContent = `
#ai-agent-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg,#1a6d73,#b8842a);color:#fff;font-size:18px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);transition:transform .2s,box-shadow .2s;display:grid;place-items:center}
#ai-agent-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,0,0,0.28)}
#ai-agent-panel{position:fixed;bottom:80px;right:24px;z-index:9999;width:360px;max-height:420px;background:#fff;border:1px solid #e0d8ce;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden}
#ai-agent-panel.open{display:flex}
#ai-agent-backdrop{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.3);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:none}
#ai-agent-backdrop.open{display:block}
#ai-agent-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #e8e0d6;background:#faf7f3}
#ai-agent-header h3{font-size:0.85rem;font-weight:700;color:#2c353a;display:flex;align-items:center;gap:8px}
#ai-agent-header h3 span{width:8px;height:8px;border-radius:50%;background:#3dd68c;display:inline-block;animation:pulse 2s infinite}
#ai-agent-close{background:none;border:none;color:#8a9aa5;font-size:1.2rem;cursor:pointer;padding:0 4px}
#ai-agent-close:hover{color:#2c353a}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
#ai-agent-msgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:#e0d8ce transparent}
#ai-agent-msgs::-webkit-scrollbar{width:4px}
#ai-agent-msgs::-webkit-scrollbar-thumb{background:#e0d8ce;border-radius:4px}
.agent-msg,.user-msg{max-width:88%;padding:10px 14px;border-radius:12px;font-size:0.82rem;line-height:1.5;word-wrap:break-word}
.agent-msg{align-self:flex-start;background:#f0ebe4;color:#3a444a;border-bottom-left-radius:4px}
.user-msg{align-self:flex-end;background:linear-gradient(135deg,#1a6d73,#2a7d83);color:#fff;border-bottom-right-radius:4px}
.agent-msg a{color:#b8842a;text-decoration:underline}
.typing-dots{display:flex;gap:4px;padding:6px 0}
.typing-dots span{width:6px;height:6px;border-radius:50%;background:#c0b8ae;animation:bounce 1.4s infinite}
.typing-dots span:nth-child(2){animation-delay:.2s}
.typing-dots span:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
#ai-agent-input-wrap{display:flex;gap:8px;padding:10px 14px 14px;border-top:1px solid #e8e0d6}
#ai-agent-input{flex:1;background:#f5f1ec;border:1px solid #e0d8ce;border-radius:8px;padding:10px 14px;color:#2c353a;font-size:0.82rem;outline:none;font-family:system-ui,sans-serif}
#ai-agent-input:focus{border-color:#b8842a}
#ai-agent-send{background:#b8842a;border:none;border-radius:8px;color:#fff;font-size:1.1rem;padding:0 10px;cursor:pointer;line-height:1;transition:background .2s}
#ai-agent-send:hover{background:#c99430}
#ai-agent-send:disabled{opacity:0.4;cursor:default}
:root[data-theme="dark"] #ai-agent-panel{background:#14181c;border-color:rgba(200,185,165,0.12);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
:root[data-theme="dark"] #ai-agent-header{border-bottom-color:rgba(200,185,165,0.08);background:rgba(200,185,165,0.03)}
:root[data-theme="dark"] #ai-agent-header h3{color:#ece6df}
:root[data-theme="dark"] #ai-agent-close{color:#6a7a85}
:root[data-theme="dark"] #ai-agent-close:hover{color:#dce4e8}
:root[data-theme="dark"] #ai-agent-msgs{scrollbar-color:rgba(200,185,165,0.1) transparent}
:root[data-theme="dark"] #ai-agent-msgs::-webkit-scrollbar-thumb{background:rgba(200,185,165,0.15)}
:root[data-theme="dark"] .agent-msg{background:rgba(200,185,165,0.06);color:#c8c8c8}
:root[data-theme="dark"] .typing-dots span{background:rgba(200,185,165,0.3)}
:root[data-theme="dark"] #ai-agent-input-wrap{border-top-color:rgba(200,185,165,0.06)}
:root[data-theme="dark"] #ai-agent-input{background:rgba(200,185,165,0.04);border-color:rgba(200,185,165,0.1);color:#dce4e8}
:root[data-theme="dark"] #ai-agent-input:focus{border-color:rgba(200,185,165,0.25)}
@media(max-width:480px){
  #ai-agent-panel{width:calc(100vw - 32px);right:16px;bottom:84px;max-height:60vh}
  #ai-agent-btn{right:16px;bottom:16px}
  #ai-agent-input{font-size:16px}
}
@media(min-width:481px){
  .lock-scroll{overflow:hidden}
}
`;
  document.head.appendChild(css);

  const btn = document.createElement("button");
  btn.id = "ai-agent-btn";
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  btn.setAttribute("aria-label", "Open AI assistant");

  const panel = document.createElement("div");
  panel.id = "ai-agent-panel";

  const headerDiv = document.createElement("div");
  headerDiv.id = "ai-agent-header";
  headerDiv.innerHTML = "<h3><span></span> " + translations.en.header + "</h3><button id=\"ai-agent-close\" aria-label=\"Close\">&times;</button>";

  const msgsDiv = document.createElement("div");
  msgsDiv.id = "ai-agent-msgs";
  msgsDiv.innerHTML = "<div class=\"agent-msg\">" + translations.en.greeting + "</div>";

  const inputWrap = document.createElement("div");
  inputWrap.id = "ai-agent-input-wrap";
  inputWrap.innerHTML = "<input id=\"ai-agent-input\" type=\"text\" placeholder=\"" + translations.en.placeholder + "\" autocomplete=\"off\" enterkeyhint=\"send\"><button id=\"ai-agent-send\">&#10148;</button>";

  panel.appendChild(headerDiv);
  panel.appendChild(msgsDiv);
  panel.appendChild(inputWrap);

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  const backdrop = document.createElement("div");
  backdrop.id = "ai-agent-backdrop";
  document.body.appendChild(backdrop);

  const msgs = document.getElementById("ai-agent-msgs");
  const input = document.getElementById("ai-agent-input");
  const sendBtn = document.getElementById("ai-agent-send");
  const closeBtn = document.getElementById("ai-agent-close");

  let waitingForMessage = false;
  let memory = [];

  function addUserMsg(text) {
    memory.push({ role: "user", text });
    const div = document.createElement("div");
    div.className = "user-msg";
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addAgentMsg(html) {
    const plain = html.replace(/<[^>]*>/g, "").replace(/<br\s*\/?>/g, " ");
    memory.push({ role: "assistant", text: plain });
    const div = document.createElement("div");
    div.className = "agent-msg";
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "agent-msg";
    div.id = "typing-indicator";
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  async function sendTelegramMessage(text) {
    try {
      const res = await fetch("/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "AI Chat Visitor", email: "via-ai-agent", message: text })
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  }

  function handleSend(e) {
    if (e) e.preventDefault();
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;
    sendBtn.disabled = true;

    if (waitingForMessage) {
      waitingForMessage = false;
      addUserMsg(text);
      input.value = "";
      sendBtn.disabled = true;
      showTyping();
      sendTelegramMessage(text).then(ok => {
        removeTyping();
        const lang = translations[currentLang] || translations.en;
        if (ok) {
          addAgentMsg(lang.sent);
        } else {
          addAgentMsg(lang.sendFail);
        }
        sendBtn.disabled = !input.value.trim();
        input.focus({ preventScroll: true });
      });
      return;
    }

    addUserMsg(text);
    input.value = "";
    sendBtn.disabled = true;
    showTyping();
    setTimeout(() => {
      removeTyping();
      const intent = matchIntent(text);
      if (intent === "message") {
        waitingForMessage = true;
        const replies = getReplies();
        addAgentMsg(replies.message[0]);
      } else {
        const reply = getReply(text);
        addAgentMsg(reply);
      }
      sendBtn.disabled = !input.value.trim();
      input.focus({ preventScroll: true });
    }, 600 + Math.random() * 800);
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasOpen = panel.classList.contains("open");
    panel.classList.toggle("open");
    backdrop.classList.toggle("open");
    if (!wasOpen) {
      setTimeout(() => {
        input.focus({ preventScroll: true });
      }, 400);
    }
  });

  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    panel.classList.remove("open");
    backdrop.classList.remove("open");
  });

  backdrop.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    panel.classList.remove("open");
    backdrop.classList.remove("open");
  });

  sendBtn.disabled = true;
  sendBtn.type = "button";
  sendBtn.addEventListener("click", (e) => { e.preventDefault(); handleSend(e); });
  input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); handleSend(e); } });
  input.addEventListener("input", () => { sendBtn.disabled = !input.value.trim(); });

  window.setAiAgentLanguage = function(langCode) {
    if (!translations[langCode]) return;
    currentLang = langCode;
    const lang = translations[langCode];
    headingEl.textContent = lang.header;
    input.placeholder = lang.placeholder;

    memory = [];
    msgs.innerHTML = "<div class=\"agent-msg\">" + lang.greeting + "</div>";
    waitingForMessage = false;

    if (langCode === "ar") {
      panel.style.direction = "rtl";
      msgs.style.direction = "rtl";
    } else {
      panel.style.direction = "";
      msgs.style.direction = "";
    }
  };

  const headingEl = headerDiv.querySelector("h3");
})();