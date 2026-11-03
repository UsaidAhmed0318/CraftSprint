'use client';
/**
 * Homepage section that introduces CraftSprint AI, our own tool assistant.
 * The buttons open the chat window (components/layout/ToolAssistant.tsx).
 * Styles: app/vip.css → "CraftSprint AI section".
 */
import Image from 'next/image';
import { Sparkles, Zap, ShieldCheck, MessageCircle, ArrowRight, SendHorizontal } from 'lucide-react';
import { openAssistant } from '@/lib/utils/assistant';

const PROMPTS = ['Make my photo under 100 KB', 'Combine two PDFs', 'Format my JSON', 'Calculate my loan EMI'];

/** Gold "Ask CraftSprint AI" button that can be used inside server pages. */
export function AskAiButton({
  label = 'Ask CraftSprint AI',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button type="button" className={`btn aiBtn ${className}`} onClick={() => openAssistant()}>
      <Image src="/images/favicon.png" alt="" width={22} height={22} />
      {label}
    </button>
  );
}

export default function AiShowcase() {
  return (
    <section className="aiShow" aria-labelledby="ai-title">
      <div className="aiShowGlow" aria-hidden="true" />
      <div className="aiShowText">
        <span className="aiKicker">
          <Sparkles size={14} /> CraftSprint AI
        </span>
        <h2 id="ai-title">
          Meet <span className="goldText">CraftSprint AI</span> — our own tool assistant
        </h2>
        <p>
          Not sure which tool you need? Tell CraftSprint AI what you want to do in plain words and it takes
          you straight to the right tool, with a tip on how to use it.
        </p>
        <ul className="aiPoints">
          <li>
            <Zap size={17} /> Finds the right tool in seconds
          </li>
          <li>
            <MessageCircle size={17} /> Ask the way you talk — no tool names needed
          </li>
          <li>
            <ShieldCheck size={17} /> Your chats are not saved, and your files never leave your device
          </li>
        </ul>
        <div className="aiActions">
          <AskAiButton label="Chat with CraftSprint AI" />
        </div>
        <div className="aiPrompts">
          {PROMPTS.map(p => (
            <button key={p} type="button" onClick={() => openAssistant(p)}>
              {p} <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </div>

      <div className="aiMock" aria-hidden="true">
        <div className="aiMockHead">
          <span className="aiMockLogo">
            <Image src="/images/favicon.png" alt="" width={34} height={34} />
          </span>
          <div>
            <b>CraftSprint AI</b>
            <small>
              <i /> Online · built for CraftSprint
            </small>
          </div>
        </div>
        <div className="aiMockBody">
          <p className="u">I need to send my CV photo but it&apos;s 2 MB</p>
          <p className="a">
            Use the <b>Image Compressor</b> — set quality to about 70% and it will be well under 200 KB.
          </p>
          <span className="aiMockChip">
            Image Compressor <ArrowRight size={13} aria-hidden="true" />
          </span>
          <p className="u">And make it a PDF?</p>
          <p className="a typing">
            <span />
            <span />
            <span />
          </p>
        </div>
        <div className="aiMockInput">
          Ask CraftSprint AI anything…{' '}
          <span>
            <SendHorizontal size={15} />
          </span>
        </div>
      </div>
    </section>
  );
}
