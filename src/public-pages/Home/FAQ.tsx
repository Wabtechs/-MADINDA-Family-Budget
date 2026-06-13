import { useState } from 'react';
import { siteContent } from '../../data/site-content';

export default function FAQ() {
  const { faq } = siteContent;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="text-center">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Questions fréquentes</h2>
          <p className="section-subtitle">
            Tout ce que vous devez savoir sur MADINDA Family Budget.
          </p>
        </div>

        <div className="faq-list">
          {faq.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
            >
              <button className="faq-question" onClick={() => toggle(index)}>
                {item.question}
                <svg
                  className="faq-chevron"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
