"use client";

export type ProposalPhase = {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
};

export type ProposalDocumentData = {
  brand: string;
  creatorName: string;
  email: string;
  phone: string;
  reference: string;
  issuedAt: string;
  validity: string;
  clientName: string;
  clientShortName: string;
  clientSlogan: string;
  recipient: string;
  summary: string;
  projectOverviewTitle: string;
  context: string;
  centralChallenge: string;
  centralChallengeLabel: string;
  objectives: { title: string; description: string; accent: string }[];
  objectivesHeading: string;
  orientation: string;
  orientationLabel: string;
  designSectionTitle: string;
  designPhases: ProposalPhase[];
  journeysHeading: string;
  journeys: string[];
  designPrinciplesHeading: string;
  designPrinciples: string[];
  developmentSectionTitle: string;
  developmentIntroduction: string;
  developmentPhases: ProposalPhase[];
  implementationNotesLabel: string;
  implementationNotes: string;
  deploymentHeading: string;
  deployment: string;
  budgetSectionTitle: string;
  budgetIntroduction: string;
  budgetItems: { phase: string; deliverables: string; amount: number }[];
  currency: string;
  payments: { label: string; percentage: number; milestone: string }[];
  paymentHeading: string;
  timelineTitle: string;
  timeline: { period: string; description: string }[];
  clientInputsHeading: string;
  clientInputs: string;
  finalChecksHeading: string;
  finalChecks: string;
};

function formatMoney(value: number, currency: string) {
  if (!Number.isFinite(value)) return `0 ${currency}`;
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value)} ${currency}`;
}

export default function ProposalDocument({
  proposal,
}: {
  proposal: ProposalDocumentData;
}) {
  const total = (proposal.budgetItems || []).reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0
  );

  return (
    <div id="proposal-preview-document" className="proposal-document mx-auto max-w-[210mm] font-azurio text-[#171b26] print:m-0 print:max-w-none print:p-0">
      {/* Sticky Print Toolbar (Screen Only) */}
      <div className="proposal-toolbar sticky top-4 z-40 mb-6 flex justify-end gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-[#121622] px-5 py-2.5 text-xs font-bold text-amber-300 shadow-2xl transition hover:bg-amber-400 hover:text-black"
        >
          <i className="pi pi-print text-sm" />
          <span>Imprimer / Enregistrer en PDF (A4)</span>
        </button>
      </div>

      {/* PAGE 1: COVER (DARK) */}
      <section className="proposal-sheet page dark relative mx-auto mb-6 flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#0b0d18] px-[17mm] py-[16mm] text-[#f8f9fa] shadow-2xl print:m-0 print:mb-0 print:h-[297mm] print:w-[210mm] print:shadow-none">
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url("/patterns/path2.svg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/15 pb-4">
          <span className="font-achiko text-3xl font-black tracking-tight text-[#f5c94d]">
            {proposal.brand}
          </span>
          <span className="text-right text-[9px] font-bold uppercase tracking-[0.14em] text-white/80">
            Ingénierie logicielle<br />UX/UI · Création numérique
          </span>
        </div>

        <div className="relative z-10 my-auto py-8">
          <div className="mb-6 inline-block rounded-none border border-[#f5c94d]/50 bg-[#f5c94d]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#f5c94d]">
            Proposition Commerciale &amp; Technique · Site Web Vitrine
          </div>
          <h1 className="font-achiko text-4xl font-black leading-tight text-white sm:text-5xl">
            {proposal.clientName.includes("&") ? (
              <>
                {proposal.clientName.split("&")[0]} <span className="text-[#f5c94d]">&amp; {proposal.clientName.split("&")[1]}</span>
              </>
            ) : (
              <span>{proposal.clientName}</span>
            )}
          </h1>
          <p className="mt-5 max-w-[155mm] text-sm leading-relaxed text-white/85">
            {proposal.summary}
          </p>

          <div className="mt-8 border-l-4 border-[#ff3b56] pl-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
              Proposition préparée pour
            </span>
            <strong className="mt-1 block font-achiko text-xl text-white">
              {proposal.clientName}
            </strong>
            <p className="mt-1 text-xs text-white/80">{proposal.clientSlogan}</p>
            <p className="mt-1 text-xs text-white/80">À l&apos;attention de {proposal.recipient}</p>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-white/15 pt-5">
            <div>
              <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">Référence</dt>
              <dd className="mt-1 font-achiko text-base font-bold text-white">{proposal.reference}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">Émise le</dt>
              <dd className="mt-1 font-achiko text-base font-bold text-white">{proposal.issuedAt}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/60">Validité</dt>
              <dd className="mt-1 font-achiko text-base font-bold text-white">{proposal.validity}</dd>
            </div>
          </dl>
        </div>

        <div className="relative z-10 flex justify-between border-t border-white/15 pt-3 text-[9px] text-white/70">
          <span>{proposal.creatorName} · {proposal.brand}</span>
          <span>{proposal.email} · {proposal.phone}</span>
        </div>
      </section>

      {/* PAGE 2: VISION & STRATEGIE (WHITE) */}
      <section className="proposal-sheet page white relative mx-auto mb-6 flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#f9f8f5] px-[17mm] py-[16mm] shadow-2xl print:m-0 print:mb-0 print:h-[297mm] print:w-[210mm] print:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-2">
            <span className="font-achiko text-sm font-bold text-[#f5c94d]">{proposal.brand}</span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-[#5a6170]">01 · Vision &amp; Positionnement de marque</span>
          </div>

          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f5c94d]">{proposal.clientName}</p>
          <h2 className="font-achiko text-2xl font-black text-[#171b26] sm:text-3xl">{proposal.projectOverviewTitle}</h2>
          <div className="my-3 h-1 w-16 bg-[#f5c94d]" />
          <p className="text-xs leading-relaxed text-[#5a6170]">{proposal.context}</p>

          <div className="my-5 border-l-4 border-[#f5c94d] bg-[#fdfaf3] p-4">
            <strong className="block text-xs text-[#171b26]">{proposal.centralChallengeLabel}</strong>
            <p className="mt-1 text-xs leading-relaxed text-[#5a6170]">{proposal.centralChallenge}</p>
          </div>

          <h3 className="mb-3 font-achiko text-base font-bold text-[#171b26]">{proposal.objectivesHeading}</h3>
          <div className="grid grid-cols-2 gap-3">
            {proposal.objectives.map((obj, i) => (
              <div key={obj.title} className={`border border-[#d9d9d4] bg-[#fafbfc] p-3 border-t-4 ${i === 1 ? "border-t-[#ff3b56]" : i === 2 ? "border-t-[#10b981]" : "border-t-[#f5c94d]"}`}>
                <strong className="block text-xs font-bold text-[#171b26]">{obj.title}</strong>
                <p className="mt-1 text-[10px] leading-relaxed text-[#5a6170]">{obj.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-[#0b0d18] p-4 text-white">
            <strong className="block text-xs text-[#f5c94d]">{proposal.orientationLabel}</strong>
            <p className="mt-1 text-xs leading-relaxed text-white/80">{proposal.orientation}</p>
          </div>
        </div>

        <div className="relative z-10 flex justify-between border-t border-[#d9d9d4] pt-2 text-[8px] uppercase tracking-widest text-[#5a6170]">
          <span>Proposition commercial · {proposal.clientShortName}</span>
          <span>02 / 05</span>
        </div>
      </section>

      {/* PAGE 3: DESIGN & DIRECTION ARTISTIQUE (WHITE) */}
      <section className="proposal-sheet page white relative mx-auto mb-6 flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#f9f8f5] px-[17mm] py-[16mm] shadow-2xl print:m-0 print:mb-0 print:h-[297mm] print:w-[210mm] print:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-2">
            <span className="font-achiko text-sm font-bold text-[#f5c94d]">{proposal.brand}</span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-[#5a6170]">02 · Direction Artistique &amp; Expérience</span>
          </div>

          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f5c94d]">Phases 01 &amp; 02</p>
          <h2 className="font-achiko text-2xl font-black text-[#171b26] sm:text-3xl">{proposal.designSectionTitle}</h2>
          <div className="my-3 h-1 w-16 bg-[#f5c94d]" />

          <div className="space-y-4">
            {proposal.designPhases.map((phase) => (
              <div key={phase.number} className="border border-[#d9d9d4] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="font-achiko text-2xl font-bold text-[#f5c94d]">{phase.number}</span>
                  <div>
                    <h3 className="font-achiko text-base font-bold text-[#171b26]">{phase.title}</h3>
                    <p className="mt-0.5 text-xs text-[#5a6170]">{phase.description}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] text-[#171b26]">
                      {phase.deliverables.map((deliv) => (
                        <li key={deliv}>{deliv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-achiko text-sm font-bold text-[#171b26]">{proposal.journeysHeading}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] text-[#5a6170]">
                {proposal.journeys.map((j) => (
                  <li key={j}>{j}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-achiko text-sm font-bold text-[#171b26]">{proposal.designPrinciplesHeading}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] text-[#5a6170]">
                {proposal.designPrinciples.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between border-t border-[#d9d9d4] pt-2 text-[8px] uppercase tracking-widest text-[#5a6170]">
          <span>Proposition commerciale · {proposal.clientShortName}</span>
          <span>03 / 05</span>
        </div>
      </section>

      {/* PAGE 4: DEVELOPPEMENT & ARCHITECTURE (WHITE) */}
      <section className="proposal-sheet page white relative mx-auto mb-6 flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#f9f8f5] px-[17mm] py-[16mm] shadow-2xl print:m-0 print:mb-0 print:h-[297mm] print:w-[210mm] print:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-2">
            <span className="font-achiko text-sm font-bold text-[#f5c94d]">{proposal.brand}</span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-[#5a6170]">03 · Technologie &amp; Ergonomie</span>
          </div>

          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f5c94d]">Phases 03 &amp; 04</p>
          <h2 className="font-achiko text-2xl font-black text-[#171b26] sm:text-3xl">{proposal.developmentSectionTitle}</h2>
          <p className="mt-1 text-xs text-[#5a6170]">{proposal.developmentIntroduction}</p>
          <div className="my-3 h-1 w-16 bg-[#f5c94d]" />

          <div className="space-y-4">
            {proposal.developmentPhases.map((phase) => (
              <div key={phase.number} className="border border-[#d9d9d4] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="font-achiko text-2xl font-bold text-[#f5c94d]">{phase.number}</span>
                  <div>
                    <h3 className="font-achiko text-base font-bold text-[#171b26]">{phase.title}</h3>
                    <p className="mt-0.5 text-xs text-[#5a6170]">{phase.description}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] text-[#171b26]">
                      {phase.deliverables.map((deliv) => (
                        <li key={deliv}>{deliv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border border-[#e7d38d] bg-[#fffaf0] p-4 text-xs text-[#574a25]">
            <strong>{proposal.implementationNotesLabel}</strong> {proposal.implementationNotes}
          </div>

          <h3 className="mt-4 font-achiko text-sm font-bold text-[#171b26]">{proposal.deploymentHeading}</h3>
          <p className="mt-1 text-xs text-[#5a6170]">{proposal.deployment}</p>
        </div>

        <div className="relative z-10 flex justify-between border-t border-[#d9d9d4] pt-2 text-[8px] uppercase tracking-widest text-[#5a6170]">
          <span>Proposition commerciale · {proposal.clientShortName}</span>
          <span>04 / 05</span>
        </div>
      </section>

      {/* PAGE 5: BUDGET & CALENDRIER (WHITE) */}
      <section className="proposal-sheet page white relative mx-auto flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#f9f8f5] px-[17mm] py-[16mm] shadow-2xl print:m-0 print:mb-0 print:h-[297mm] print:w-[210mm] print:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-[#d9d9d4] pb-2">
            <span className="font-achiko text-sm font-bold text-[#f5c94d]">{proposal.brand}</span>
            <span className="text-[9px] uppercase tracking-[0.13em] text-[#5a6170]">04 · Chiffrage &amp; Planning</span>
          </div>

          <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-[#f5c94d]">Estimation Financière</p>
          <h2 className="font-achiko text-2xl font-black text-[#171b26] sm:text-3xl">{proposal.budgetSectionTitle}</h2>
          <p className="mt-1 text-xs text-[#5a6170]">{proposal.budgetIntroduction}</p>

          <div className="my-4 flex items-center justify-between bg-[#0b0d18] px-5 py-3 text-white">
            <span className="text-xs text-white/70">Budget Total Estimatif</span>
            <strong className="font-achiko text-2xl text-[#f5c94d]">
              {formatMoney(total, proposal.currency)}
            </strong>
          </div>

          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#d9d9d4] text-[9px] uppercase tracking-wider text-[#5a6170]">
                <th className="py-2.5">Phase de réalisation</th>
                <th className="py-2.5">Livrables principaux</th>
                <th className="py-2.5 text-right">Estimation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d4]">
              {(proposal.budgetItems || []).map((item) => (
                <tr key={item.phase}>
                  <td className="py-3 pr-2 font-bold text-[#171b26]">{item.phase}</td>
                  <td className="py-3 pr-2 text-[#5a6170]">{item.deliverables}</td>
                  <td className="py-3 text-right font-bold text-[#171b26]">{formatMoney(item.amount, proposal.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-6 font-achiko text-sm font-bold text-[#171b26]">{proposal.paymentHeading}</h3>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {proposal.payments.map((p) => (
              <div key={p.label} className="border border-[#d9d9d4] bg-white p-3">
                <span className="text-[9px] text-[#5a6170]">{p.label} ({p.percentage}%)</span>
                <strong className="my-1 block font-achiko text-base text-[#171b26]">
                  {formatMoney(Math.round(total * p.percentage / 100), proposal.currency)}
                </strong>
                <span className="text-[9px] text-[#5a6170]">{p.milestone}</span>
              </div>
            ))}
          </div>

          <h3 className="mt-6 font-achiko text-sm font-bold text-[#171b26]">{proposal.timelineTitle}</h3>
          <ul className="mt-2 divide-y divide-[#d9d9d4] text-xs">
            {(proposal.timeline || []).map((item) => (
              <li key={item.period} className="grid grid-cols-[100px_1fr] gap-3 py-2">
                <strong className="text-[#8c6700]">{item.period}</strong>
                <span className="text-[#5a6170]">{item.description}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#171b26] pt-4 text-xs text-[#5a6170]">
            <div>
              <strong className="block text-[#171b26]">Pour {proposal.clientShortName}</strong>
              <p className="mt-1">Nom, date &amp; signature :</p>
            </div>
            <div>
              <strong className="block text-[#171b26]">{proposal.creatorName} · {proposal.brand}</strong>
              <p className="mt-1">Bon pour accord après validation final du devis</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-between border-t border-[#d9d9d4] pt-2 text-[8px] uppercase tracking-widest text-[#5a6170]">
          <span>Contact · {proposal.email} · {proposal.phone}</span>
          <span>05 / 05</span>
        </div>
      </section>
    </div>
  );
}