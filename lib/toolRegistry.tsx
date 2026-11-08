'use client';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Which component renders each tool.
 * To add a tool: build the component, then add one line here (plus one line in data/tools.ts and data/seo.ts).
 * Each tool loads on its own, so a page only downloads the code it needs.
 */
const toolComponents: Record<string, ComponentType> = {
  'heic-to-jpg': dynamic(() => import('@/components/tools/batch2/Converters2').then(m => m.HeicToJpg)),
  'image-upscaler': dynamic(() => import('@/components/tools/batch2/Converters2').then(m => m.ImageUpscaler)),
  'pdf-to-word': dynamic(() => import('@/components/tools/batch2/Converters2').then(m => m.PdfToWord)),
  'video-compressor': dynamic(() =>
    import('@/components/tools/batch2/Converters2').then(m => m.VideoCompressor),
  ),
  'pakistan-salary-tax-calculator': dynamic(() =>
    import('@/components/tools/batch2/Converters2').then(m => m.PakistanSalaryTax),
  ),
  'image-studio': dynamic(() => import('@/components/tools/batch2/ImageStudio').then(m => m.ImageStudio)),
  'ai-writing-studio': dynamic(() =>
    import('@/components/tools/batch2/AiWritingStudio').then(m => m.AiWritingStudio),
  ),
  'smart-qr-generator': dynamic(() => import('@/components/tools/batch2/EverydayPlus').then(m => m.SmartQr)),
  'coin-flip-dice-roller': dynamic(() =>
    import('@/components/tools/batch2/EverydayPlus').then(m => m.CoinDice),
  ),
  'citation-generator': dynamic(() =>
    import('@/components/tools/batch2/EverydayPlus').then(m => m.CitationGenerator),
  ),
  'hijri-date-converter': dynamic(() =>
    import('@/components/tools/batch2/EverydayPlus').then(m => m.HijriConverter),
  ),
  'freelance-rate-calculator': dynamic(() =>
    import('@/components/tools/batch2/EverydayPlus').then(m => m.FreelanceRate),
  ),
  'reading-time-calculator': dynamic(() =>
    import('@/components/tools/batch2/EverydayPlus').then(m => m.ReadingTime),
  ),
  'screen-recorder': dynamic(() =>
    import('@/components/tools/batch2/MediaRecorders').then(m => m.ScreenRecorder),
  ),
  'voice-recorder': dynamic(() =>
    import('@/components/tools/batch2/MediaRecorders').then(m => m.VoiceRecorder),
  ),
  'speech-to-text': dynamic(() =>
    import('@/components/tools/batch2/MediaRecorders').then(m => m.SpeechToText),
  ),
  'webcam-mic-test': dynamic(() =>
    import('@/components/tools/batch2/MediaRecorders').then(m => m.WebcamMicTest),
  ),
  'word-guess': dynamic(() => import('@/components/tools/games/WordPuzzle').then(m => m.WordGuess)),
  'sliding-puzzle': dynamic(() => import('@/components/tools/games/WordPuzzle').then(m => m.SlidingPuzzle)),
  'domain-age-checker': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.DomainAgeChecker),
  ),
  'open-graph-generator': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.OpenGraphGenerator),
  ),
  'website-speed-checker': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.WebsiteSpeedChecker),
  ),
  'whatsapp-link-generator': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.WhatsAppLinkGenerator),
  ),
  'payment-reminder-generator': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.PaymentReminder),
  ),
  'google-review-qr-generator': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.GoogleReviewQr),
  ),
  'sip-calculator': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.SipCalculator)),
  'roi-calculator': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.RoiCalculator)),
  'break-even-calculator': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.BreakEvenCalculator),
  ),
  'remove-duplicate-lines': dynamic(() =>
    import('@/components/tools/batch2/NewTools3').then(m => m.RemoveDuplicateLines),
  ),
  'text-sorter': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.TextSorter)),
  'find-and-replace': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.FindReplace)),
  'sql-formatter': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.SqlFormatter)),
  'xml-formatter': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.XmlFormatter)),
  'rotate-pdf': dynamic(() => import('@/components/tools/batch2/NewTools3').then(m => m.RotatePdf)),
  'block-stack': dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.BlockStack)),
  'brick-breaker': dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.BrickBreaker)),
  'space-defender': dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.SpaceDefender)),
  'sky-hopper': dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.SkyHopper)),
  'whack-a-mole': dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.WhackAMole)),
  sudoku: dynamic(() => import('@/components/tools/games/MoreArcade').then(m => m.Sudoku)),
  'age-calculator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.AgeCalculator),
  ),
  'ai-token-counter': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.AiTokenCounter),
  ),
  'api-tester': dynamic(() => import('@/components/tools/developer/WebDevTools').then(m => m.ApiTester)),
  'aspect-ratio-calculator': dynamic(() =>
    import('@/components/tools/design/DesignTools').then(m => m.AspectRatioCalculator),
  ),
  'audio-speed-changer': dynamic(() =>
    import('@/components/tools/media/MediaTools').then(m => m.AudioSpeedChanger),
  ),
  'audio-trimmer': dynamic(() => import('@/components/tools/media/MediaTools').then(m => m.AudioTrimmer)),
  'background-remover': dynamic(() =>
    import('@/components/tools/images/BackgroundRemover').then(m => m.BackgroundRemover),
  ),
  'barcode-generator': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.BarcodeGenerator),
  ),
  'base64-converter': dynamic(() =>
    import('@/components/tools/developer/EncodingTools').then(m => m.Base64Tool),
  ),
  'blog-outline-generator': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.BlogOutlineGenerator),
  ),
  'bmi-calculator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.BmiCalculator),
  ),
  'border-radius-previewer': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.BorderRadiusPreviewer),
  ),
  'box-shadow-generator': dynamic(() =>
    import('@/components/tools/design/DesignTools').then(m => m.BoxShadowGenerator),
  ),
  'calorie-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.CalorieCalculator),
  ),
  'case-converter': dynamic(() => import('@/components/tools/writing/TextTools').then(m => m.CaseConverter)),
  'chmod-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.ChmodCalculator),
  ),
  'color-contrast-checker': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.ColorContrastChecker),
  ),
  'color-converter': dynamic(() =>
    import('@/components/tools/calculators/Converters').then(m => m.ColorConverter),
  ),
  'color-palette-extractor': dynamic(() =>
    import('@/components/tools/design/DesignTools').then(m => m.ColorPaletteExtractor),
  ),
  'color-palette-generator': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.ColorPaletteGenerator),
  ),
  'compound-interest-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.CompoundInterestCalculator),
  ),
  'cron-parser': dynamic(() => import('@/components/tools/developer/UtilityTools').then(m => m.CronParser)),
  'css-flexbox-generator': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.CssFlexboxGenerator),
  ),
  'css-gradient-generator': dynamic(() =>
    import('@/components/tools/design/DesignTools').then(m => m.CssGradientGenerator),
  ),
  'css-grid-generator': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.CssGridGenerator),
  ),
  'css-keyframe-generator': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.CssKeyframeGenerator),
  ),
  'css-minifier': dynamic(() => import('@/components/tools/developer/WebDevTools').then(m => m.CssMinifier)),
  'csv-to-json-converter': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.CsvToJsonConverter),
  ),
  'cta-generator': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.CtaGenerator),
  ),
  'currency-converter': dynamic(() =>
    import('@/components/tools/productivity/ProductivityTools').then(m => m.CurrencyConverter),
  ),
  'date-calculator': dynamic(() =>
    import('@/components/tools/calculators/BusinessCalculators').then(m => m.DateCalculator),
  ),
  'digital-signature-creator': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.DigitalSignatureCreator),
  ),
  'discount-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.DiscountCalculator),
  ),
  'email-subject-line-tester': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.EmailSubjectLineTester),
  ),
  'favicon-generator': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.FaviconGenerator),
  ),
  'font-pairing-finder': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.FontPairingFinder),
  ),
  'fraction-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.FractionCalculator),
  ),
  'fuel-cost-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.FuelCostCalculator),
  ),
  'game-2048': dynamic(() => import('@/components/tools/games/ArcadeGames').then(m => m.Game2048)),
  'gif-optimizer': dynamic(() => import('@/components/tools/media/MediaTools').then(m => m.GifOptimizer)),
  'gpa-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.GpaCalculator),
  ),
  'hash-generator': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.HashGenerator),
  ),
  'hashtag-generator': dynamic(() =>
    import('@/components/tools/writing/MarketingTools').then(m => m.HashtagGenerator),
  ),
  'headline-analyzer': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.HeadlineAnalyzer),
  ),
  'html-minifier': dynamic(() =>
    import('@/components/tools/developer/WebDevTools').then(m => m.HtmlMinifier),
  ),
  'html-to-markdown-converter': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.HtmlToMarkdownConverter),
  ),
  'image-compressor': dynamic(() =>
    import('@/components/tools/images/ImageTools').then(m => m.ImageCompressor),
  ),
  'image-converter': dynamic(() =>
    import('@/components/tools/images/ImageTools').then(m => m.ImageConverter),
  ),
  'image-cropper': dynamic(() => import('@/components/tools/design/DesignStudio').then(m => m.ImageCropper)),
  'image-resizer': dynamic(() => import('@/components/tools/images/ImageTools').then(m => m.ImageResizer)),
  'image-to-base64': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.ImageToBase64),
  ),
  'image-to-pdf-converter': dynamic(() =>
    import('@/components/tools/pdf/PdfTools').then(m => m.ImageToPdfConverter),
  ),
  'image-watermark': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.ImageWatermark),
  ),
  'invoice-generator': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.InvoiceGenerator),
  ),
  'js-minifier': dynamic(() => import('@/components/tools/developer/WebDevTools').then(m => m.JsMinifier)),
  'js-obfuscator': dynamic(() =>
    import('@/components/tools/developer/WebDevTools').then(m => m.JsObfuscator),
  ),
  'json-formatter': dynamic(() =>
    import('@/components/tools/developer/EncodingTools').then(m => m.JsonFormatter),
  ),
  'json-to-csv-converter': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.JsonToCsvConverter),
  ),
  'json-to-typescript': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.JsonToTsConverter),
  ),
  'jwt-decoder': dynamic(() => import('@/components/tools/developer/CodeTools').then(m => m.JwtDecoder)),
  'kanban-board': dynamic(() =>
    import('@/components/tools/productivity/KanbanBoard').then(m => m.KanbanBoard),
  ),
  'keyword-density-checker': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.KeywordDensityChecker),
  ),
  'loan-emi-calculator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.LoanEmiCalculator),
  ),
  'lorem-ipsum-generator': dynamic(() =>
    import('@/components/tools/writing/TextTools').then(m => m.LoremIpsumGenerator),
  ),
  'markdown-previewer': dynamic(() =>
    import('@/components/tools/writing/WritingTools').then(m => m.MarkdownPreviewer),
  ),
  'markdown-to-html-converter': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.MarkdownToHtmlConverter),
  ),
  'memory-match': dynamic(() => import('@/components/tools/games/ArcadeGames').then(m => m.MemoryMatch)),
  'meta-tag-generator': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.MetaTagGenerator),
  ),
  minesweeper: dynamic(() => import('@/components/tools/games/ArcadeGames').then(m => m.Minesweeper)),
  'mockup-generator': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.MockupGenerator),
  ),
  'morse-code-translator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.MorseCodeTranslator),
  ),
  'number-base-converter': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.NumberBaseConverter),
  ),
  'ohms-law-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.OhmsLawCalculator),
  ),
  'password-generator': dynamic(() =>
    import('@/components/tools/calculators/Converters').then(m => m.PasswordGenerator),
  ),
  'password-strength-checker': dynamic(() =>
    import('@/components/tools/productivity/ProductivityTools').then(m => m.PasswordStrengthChecker),
  ),
  'pdf-compressor': dynamic(() => import('@/components/tools/pdf/PdfTools').then(m => m.PdfCompressor)),
  'pdf-merge': dynamic(() => import('@/components/tools/pdf/PdfTools').then(m => m.PdfMergeTool)),
  'pdf-password-protector': dynamic(() =>
    import('@/components/tools/pdf/PdfTools').then(m => m.PdfPasswordProtector),
  ),
  'pdf-password-unlocker': dynamic(() =>
    import('@/components/tools/pdf/PdfTools').then(m => m.PdfPasswordUnlocker),
  ),
  'pdf-split': dynamic(() => import('@/components/tools/pdf/PdfTools').then(m => m.PdfSplitTool)),
  'pdf-text-extractor': dynamic(() =>
    import('@/components/tools/pdf/PdfTools').then(m => m.PdfTextExtractor),
  ),
  'pdf-to-image-converter': dynamic(() =>
    import('@/components/tools/pdf/PdfTools').then(m => m.PdfToImageConverter),
  ),
  'percentage-calculator': dynamic(() =>
    import('@/components/tools/calculators/BusinessCalculators').then(m => m.PercentageCalculator),
  ),
  'placeholder-image-generator': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.PlaceholderImageGenerator),
  ),
  'plagiarism-checker': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.PlagiarismCheckerHelper),
  ),
  'png-to-svg-converter': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.PngToSvgWrapper),
  ),
  'pomodoro-timer': dynamic(() =>
    import('@/components/tools/productivity/ProductivityTools').then(m => m.PomodoroTimer),
  ),
  'profit-margin-calculator': dynamic(() =>
    import('@/components/tools/calculators/BusinessCalculators').then(m => m.ProfitMarginCalculator),
  ),
  'qr-code-generator': dynamic(() => import('@/components/tools/design/QrTool').then(m => m.QrCodeGenerator)),
  'qr-code-scanner': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.QrCodeScanner),
  ),
  'quadratic-equation-solver': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.QuadraticSolver),
  ),
  'random-number-generator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.RandomNumberGenerator),
  ),
  'random-picker-wheel': dynamic(() =>
    import('@/components/tools/productivity/ProductivityTools').then(m => m.RandomPickerWheel),
  ),
  'readability-checker': dynamic(() =>
    import('@/components/tools/writing/WritingTools').then(m => m.ReadabilityChecker),
  ),
  'receipt-maker': dynamic(() => import('@/components/tools/pdf/DocumentTools').then(m => m.ReceiptMaker)),
  'regex-tester': dynamic(() => import('@/components/tools/developer/UtilityTools').then(m => m.RegexTester)),
  'resistor-color-code': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.ResistorColorCode),
  ),
  'resume-builder': dynamic(() => import('@/components/tools/pdf/DocumentTools').then(m => m.ResumeBuilder)),
  'robots-txt-generator': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.RobotsTxtGenerator),
  ),
  'roman-numeral-converter': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.RomanNumeralConverter),
  ),
  'scientific-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.ScientificCalculator),
  ),
  'seo-meta-preview': dynamic(() =>
    import('@/components/tools/writing/WritingTools').then(m => m.SeoMetaPreview),
  ),
  'sitemap-generator': dynamic(() =>
    import('@/components/tools/developer/CodeTools').then(m => m.SitemapGenerator),
  ),
  'slug-generator': dynamic(() =>
    import('@/components/tools/writing/WritingTools').then(m => m.SlugGenerator),
  ),
  'snake-game': dynamic(() => import('@/components/tools/games/ArcadeGames').then(m => m.SnakeGame)),
  'social-bio-generator': dynamic(() =>
    import('@/components/tools/writing/SeoContentTools').then(m => m.SocialBioGenerator),
  ),
  'sql-query-builder': dynamic(() =>
    import('@/components/tools/developer/WebDevTools').then(m => m.SqlQueryBuilder),
  ),
  'srt-subtitle-formatter': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.SrtSubtitleFormatter),
  ),
  'statistics-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.StatisticsCalculator),
  ),
  'stopwatch-countdown': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.StopwatchCountdown),
  ),
  'subnet-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.SubnetCalculator),
  ),
  'svg-animation-previewer': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.SvgAnimationPreviewer),
  ),
  'svg-pattern-generator': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.SvgPatternGenerator),
  ),
  'svg-to-png-converter': dynamic(() =>
    import('@/components/tools/design/DesignStudio').then(m => m.SvgToPngConverter),
  ),
  'tailwind-config-generator': dynamic(() =>
    import('@/components/tools/developer/WebDevTools').then(m => m.TailwindConfigGenerator),
  ),
  'line-break-remover': dynamic(() =>
    import('@/components/tools/writing/TextTools').then(m => m.LineBreakRemover),
  ),
  'text-cleaner': dynamic(() => import('@/components/tools/images/ImageTools').then(m => m.TextCleaner)),
  'text-diff-checker': dynamic(() =>
    import('@/components/tools/pdf/DocumentTools').then(m => m.TextDiffChecker),
  ),
  'text-to-pdf': dynamic(() => import('@/components/tools/pdf/PdfTools').then(m => m.TextToPdfConverter)),
  'text-to-speech': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.TextToSpeech),
  ),
  'tic-tac-toe': dynamic(() => import('@/components/tools/games/ArcadeGames').then(m => m.TicTacToe)),
  'timestamp-converter': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.TimestampConverter),
  ),
  'timezone-meeting-planner': dynamic(() =>
    import('@/components/tools/productivity/ProductivityTools').then(m => m.TimezoneMeetingPlanner),
  ),
  'tip-bill-splitter': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.TipBillSplitter),
  ),
  'typing-speed-test': dynamic(() =>
    import('@/components/tools/games/ArcadeGames').then(m => m.TypingSpeedTest),
  ),
  'unit-converter': dynamic(() =>
    import('@/components/tools/calculators/Converters').then(m => m.UnitConverter),
  ),
  'url-encoder-decoder': dynamic(() =>
    import('@/components/tools/developer/WebDevTools').then(m => m.UrlEncoderDecoder),
  ),
  'utm-link-builder': dynamic(() =>
    import('@/components/tools/writing/MarketingTools').then(m => m.UtmLinkBuilder),
  ),
  'uuid-generator': dynamic(() =>
    import('@/components/tools/developer/UtilityTools').then(m => m.UuidGenerator),
  ),
  'vat-calculator': dynamic(() =>
    import('@/components/tools/calculators/MathCalculators').then(m => m.VatCalculator),
  ),
  'video-thumbnail-grabber': dynamic(() =>
    import('@/components/tools/design/DesignGenerators').then(m => m.VideoThumbnailGrabber),
  ),
  'video-to-gif-converter': dynamic(() =>
    import('@/components/tools/media/MediaTools').then(m => m.VideoToGifConverter),
  ),
  'word-counter': dynamic(() => import('@/components/tools/writing/TextTools').then(m => m.WordCounter)),
  'zakat-calculator': dynamic(() =>
    import('@/components/tools/calculators/EverydayTools').then(m => m.ZakatCalculator),
  ),
  'connect-four': dynamic(() => import('@/components/tools/games/PuzzleGames').then(m => m.ConnectFour)),
  hangman: dynamic(() => import('@/components/tools/games/PuzzleGames').then(m => m.Hangman)),
  'reaction-time-test': dynamic(() =>
    import('@/components/tools/games/PuzzleGames').then(m => m.ReactionTime),
  ),
  'simon-says': dynamic(() => import('@/components/tools/games/PuzzleGames').then(m => m.SimonSays)),
};

/** Renders one tool by slug. Client-only file, so each page downloads only its own tool's code. */
export default function ToolRenderer({ slug }: { slug: string }) {
  const Tool = toolComponents[slug];
  return Tool ? <Tool /> : null;
}
export const hasTool = (slug: string) => slug in toolComponents;
