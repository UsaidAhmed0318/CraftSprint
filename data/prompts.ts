/** AI prompt library: ready-to-use prompts. Replace the [BRACKETS] with your own details. */
export type Prompt = { title: string; text: string };
export type PromptGroup = { slug: string; name: string; description: string; prompts: Prompt[] };

export const promptGroups: PromptGroup[] = [
  {
    slug: 'writing',
    name: 'Writing & Content',
    description: 'Blog posts, emails, captions and rewrites in the tone you want.',
    prompts: [
      {
        title: 'Blog post outline',
        text: 'Create a detailed outline for a blog post about [TOPIC] for [AUDIENCE]. Include a catchy title, an introduction hook, 5–7 H2 sections with bullet points, and a short conclusion with a call to action.',
      },
      {
        title: 'Rewrite to sound professional',
        text: 'Rewrite the text below so it sounds clear, friendly and professional. Keep the meaning, fix grammar, and keep it under [WORD LIMIT] words.\n\n[PASTE YOUR TEXT]',
      },
      {
        title: 'Instagram captions',
        text: 'Write 5 Instagram captions for a post about [PRODUCT OR MOMENT]. Brand tone: [TONE]. Each caption under 150 characters, with 3 relevant hashtags and one emoji at most.',
      },
      {
        title: 'Cold email',
        text: 'Write a short cold email to [PERSON / ROLE] at [COMPANY] offering [YOUR SERVICE]. Mention one specific benefit for them, keep it under 120 words, and end with a simple question as the call to action.',
      },
      {
        title: 'Summarise in plain words',
        text: 'Summarise the text below in 5 bullet points a 12-year-old could understand, then give one sentence on why it matters.\n\n[PASTE TEXT]',
      },
      {
        title: 'YouTube script',
        text: 'Write a 3-minute YouTube script about [TOPIC] for [AUDIENCE]. Start with a 10-second hook, use short spoken sentences, add [B-ROLL] notes, and end with a subscribe call to action.',
      },
    ],
  },
  {
    slug: 'business',
    name: 'Business & Marketing',
    description: 'Plans, ads, pricing and customer messages for small businesses.',
    prompts: [
      {
        title: 'One-page business plan',
        text: 'Create a one-page business plan for [BUSINESS IDEA] in [CITY / COUNTRY]. Include: problem, solution, target customers, pricing, marketing channels, first 90-day goals and the three biggest risks.',
      },
      {
        title: 'Facebook ad copy',
        text: 'Write 3 Facebook ad variations for [PRODUCT] aimed at [AUDIENCE]. Each with a headline (max 40 characters), primary text (max 125 characters) and a call-to-action button suggestion.',
      },
      {
        title: 'Product description',
        text: 'Write an Amazon-style product description for [PRODUCT] with 5 benefit-led bullet points and a 100-word paragraph. Key features: [FEATURES]. Avoid claims that cannot be proven.',
      },
      {
        title: 'Reply to a negative review',
        text: 'Write a calm, professional reply to this customer review. Apologise for the experience, explain what we will do, and invite them to contact [EMAIL / PHONE].\n\nReview: [PASTE REVIEW]',
      },
      {
        title: 'Pricing ideas',
        text: 'Suggest 3 pricing options (basic, standard, premium) for [SERVICE] for customers in [MARKET]. Show what each includes and who it is for, in a table.',
      },
      {
        title: 'Business name ideas',
        text: 'Give me 20 short, memorable business names for a [TYPE OF BUSINESS] that feels [STYLE: modern / premium / friendly]. Add a one-line reason for the top 5.',
      },
    ],
  },
  {
    slug: 'coding',
    name: 'Coding & Web Development',
    description: 'Build pages, debug errors and explain code.',
    prompts: [
      {
        title: 'Build a landing page',
        text: 'Build a complete, responsive landing page in one HTML file (inline CSS and JS) for [BUSINESS / PRODUCT]. Sections: hero with headline and button, 3 features, testimonials placeholder, pricing, FAQ and footer. Colours: [COLOURS].',
      },
      {
        title: 'Fix this error',
        text: 'I get this error in my [LANGUAGE / FRAMEWORK] project. Explain the cause in simple words and show the corrected code.\n\nError: [PASTE ERROR]\n\nCode: [PASTE CODE]',
      },
      {
        title: 'Explain code line by line',
        text: 'Explain what this code does, line by line, for a beginner. Then suggest one improvement.\n\n[PASTE CODE]',
      },
      {
        title: 'Write a function',
        text: 'Write a [LANGUAGE] function that [WHAT IT SHOULD DO]. Include input checks, comments and 3 example calls with expected output.',
      },
      {
        title: 'SQL query',
        text: 'Write an SQL query for [DATABASE: MySQL / PostgreSQL] that [WHAT YOU NEED]. Tables: [TABLE NAMES AND COLUMNS]. Explain the query in two sentences.',
      },
      {
        title: 'Regex',
        text: 'Write a regular expression that matches [WHAT TO MATCH] and does not match [WHAT TO AVOID]. Explain each part and give 3 matching and 3 non-matching examples.',
      },
    ],
  },
  {
    slug: 'career',
    name: 'Career & Jobs',
    description: 'CVs, cover letters, interviews and LinkedIn.',
    prompts: [
      {
        title: 'Improve my CV bullet points',
        text: 'Rewrite these CV bullet points so they start with a strong action verb and show results with numbers where possible. Role: [JOB TITLE].\n\n[PASTE BULLETS]',
      },
      {
        title: 'Cover letter',
        text: 'Write a 250-word cover letter for the [JOB TITLE] role at [COMPANY]. My key strengths: [STRENGTHS]. Match the tone of this job ad: [PASTE KEY PARTS OF THE AD].',
      },
      {
        title: 'Interview practice',
        text: 'Act as an interviewer for a [JOB TITLE] position. Ask me one question at a time (mix of behavioural and technical), wait for my answer, then give short feedback and a better sample answer.',
      },
      {
        title: 'LinkedIn headline & About',
        text: 'Write 3 LinkedIn headline options (max 220 characters) and a 150-word About section for a [ROLE] with experience in [SKILLS / INDUSTRY]. Friendly, first person.',
      },
      {
        title: 'Salary negotiation email',
        text: 'Write a polite email asking to discuss the salary offer for [ROLE] at [COMPANY]. Offer: [AMOUNT]. Hoping for: [AMOUNT], because [REASONS].',
      },
    ],
  },
  {
    slug: 'study',
    name: 'Study & Learning',
    description: 'Explain topics, make quizzes and plan study time.',
    prompts: [
      {
        title: 'Explain like I’m new',
        text: 'Explain [TOPIC] in simple words with one everyday example, then a short summary, then 3 questions to test my understanding.',
      },
      {
        title: 'Make a quiz',
        text: 'Make a 10-question multiple-choice quiz on [TOPIC] for [LEVEL: school / university]. Put the answers with a one-line explanation at the end.',
      },
      {
        title: 'Study plan',
        text: 'Create a [NUMBER]-week study plan to learn [SUBJECT] with [HOURS] hours a week. Include weekly goals, free resources and a small project at the end.',
      },
      {
        title: 'Flashcards',
        text: 'Turn these notes into 15 question-and-answer flashcards. Keep each answer under 25 words.\n\n[PASTE NOTES]',
      },
      {
        title: 'Translate and explain',
        text: 'Translate this text into [LANGUAGE] and explain any idioms or difficult words.\n\n[PASTE TEXT]',
      },
    ],
  },
  {
    slug: 'images',
    name: 'AI Image Prompts',
    description: 'Prompts for image generators like Midjourney, DALL·E or Gemini.',
    prompts: [
      {
        title: 'Professional headshot',
        text: 'Professional headshot of [DESCRIBE PERSON], wearing [CLOTHING], soft studio lighting, neutral grey background, shallow depth of field, sharp focus on the eyes, photorealistic, 85mm lens.',
      },
      {
        title: 'Product photo',
        text: 'Clean e-commerce product photo of [PRODUCT] on a [SURFACE], soft natural light from the left, subtle shadow, minimal background in [COLOUR], high detail, 4:5 ratio.',
      },
      {
        title: 'YouTube thumbnail',
        text: 'Bold YouTube thumbnail for a video titled "[TITLE]", one expressive face on the right, large readable text on the left, high contrast [COLOURS], simple background, 16:9.',
      },
      {
        title: 'Logo concept',
        text: 'Minimal flat vector logo for [BRAND NAME], a [TYPE OF BUSINESS], using [SYMBOL IDEA], two colours [COLOURS], white background, no gradients, simple and memorable.',
      },
      {
        title: 'Social media post',
        text: 'Eye-catching square social media graphic announcing [EVENT / OFFER], modern layout, [BRAND COLOURS], space for a headline at the top, friendly illustrated style.',
      },
      {
        title: '3D icon',
        text: 'Glossy 3D icon of [OBJECT], soft clay render, rounded shapes, [COLOUR] palette, isometric view, soft shadow, plain background.',
      },
    ],
  },
  {
    slug: 'productivity',
    name: 'Productivity & Life',
    description: 'Plan your day, decide faster and organise tasks.',
    prompts: [
      {
        title: 'Plan my day',
        text: 'Here are my tasks for today: [LIST TASKS]. I have [HOURS] hours and my energy is best in the [MORNING / EVENING]. Make a realistic schedule with breaks and put the most important task first.',
      },
      {
        title: 'Help me decide',
        text: 'Help me decide between [OPTION A] and [OPTION B]. My priorities are [PRIORITIES]. Make a pros-and-cons table, then give a recommendation and what would change it.',
      },
      {
        title: 'Meeting notes to actions',
        text: 'Turn these meeting notes into: a 3-line summary, decisions made, and an action list with owner and deadline.\n\n[PASTE NOTES]',
      },
      {
        title: 'Weekly meal plan',
        text: 'Create a 7-day meal plan for [NUMBER] people with a budget of [BUDGET], [DIET PREFERENCES]. Include a shopping list grouped by aisle.',
      },
      {
        title: 'Travel itinerary',
        text: 'Plan a [NUMBER]-day trip to [CITY] for [TRAVELLERS] with a [BUDGET LEVEL] budget. Day-by-day plan with morning, afternoon and evening, plus local food to try.',
      },
    ],
  },
  {
    slug: 'seo',
    name: 'SEO & Websites',
    description: 'Keywords, meta tags and content ideas that help pages rank.',
    prompts: [
      {
        title: 'Keyword ideas',
        text: 'Give me 30 keyword ideas for a page about [TOPIC] targeting [COUNTRY]. Group them by search intent (informational, commercial, transactional) and mark the 5 best for a new website.',
      },
      {
        title: 'Meta title & description',
        text: 'Write 3 SEO title tags (max 60 characters) and 3 meta descriptions (max 155 characters) for a page about [PAGE TOPIC]. Include the keyword [KEYWORD] naturally.',
      },
      {
        title: 'FAQ section',
        text: 'Write 6 frequently asked questions with short, helpful answers (40–60 words each) for a page about [TOPIC]. Write them so they could appear in Google’s “People also ask”.',
      },
      {
        title: 'Content refresh',
        text: 'Here is an old article. Suggest what to update to make it more useful in [YEAR]: missing sections, outdated facts to check, better headings and internal links.\n\n[PASTE ARTICLE]',
      },
      {
        title: 'Local SEO checklist',
        text: 'Create a local SEO checklist for a [TYPE OF BUSINESS] in [CITY], including Google Business Profile, reviews, citations and on-page steps.',
      },
    ],
  },
];
