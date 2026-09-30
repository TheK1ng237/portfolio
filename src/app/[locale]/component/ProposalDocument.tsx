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

function formatMoney(amount: number, currency: string) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
}

function SectionHeader({ brand, label }: { brand: string; label: string }) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4 border-b border-[#d9dce3] pb-3">
      <span className="font-achiko text-sm text-[#b98a09]">{brand}</span>
      <span className="text-right font-azurio text-[9px] font-bold uppercase tracking-[0.12em] text-[#5c6270]">
        {label}
      </span>
    </header>
  );
}

function PageFooter({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {
  return (
    <footer className="absolute inset-x-[17mm] bottom-[8mm] flex justify-between gap-3 border-t border-[#d9dce3] pt-2.5 font-azurio text-[8px] text-[#5c6270]">
      <span>{children}</span>
      <span>{page} / 05</span>
    </footer>
  );
}

function PhaseBlock({ phase }: { phase: ProposalPhase }) {
  return (
    <article className="mb-5 break-inside-avoid border border-[#d9dce3] p-4">
      <div className="mb-2 flex items-start gap-3">
        <span className="font-achiko text-lg text-[#a57800]">{phase.number}</span>
        <div>
          <h3 className="font-achiko text-base text-[#171923]">{phase.title}</h3>
          <p className="font-azurio text-[9px] text-[#5c6270]">{phase.description}</p>
        </div>
      </div>
      <ul className="list-disc space-y-1 pl-5 font-azurio text-[10px] leading-[1.45] text-[#252834] marker:text-[#b98a09]">
        {phase.deliverables.map((deliverable) => (
          <li key={deliverable}>{deliverable}</li>
        ))}
      </ul>
    </article>
  );
}

export default function ProposalDocument({
  proposal,
}: {
  proposal: ProposalDocumentData;
}) {
  const total = proposal.budgetItems.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);

  return (
    <div id="proposal-preview" className="proposal-document mx-auto max-w-[210mm] pb-10 font-azurio text-[#171923] print:pb-0">
      <div className="proposal-toolbar sticky top-20 z-30 mx-4 mb-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 border border-[#ffc82c]/50 bg-[#121526] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:border-[#ffc82c] hover:text-[#ffc82c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc82c]"
        >
          <i className="pi pi-print" aria-hidden="true" />
          Imprimer / Enregistrer en PDF
        </button>
      </div>

      <section className="proposal-sheet relative mx-auto mb-5 flex min-h-[297mm] w-full flex-col justify-between overflow-hidden bg-[#0b0d18] px-[17mm] py-[16mm] text-[#f8f9fa] shadow-2xl print:mb-0 print:h-[297mm] print:min-h-0 print:w-[210mm] print:shadow-none">
        <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-[#ffc82c]/25 shadow-[0_0_0_38px_rgba(255,200,44,0.025),0_0_0_82px_rgba(255,59,86,0.025)]" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <span className="font-achiko text-2xl text-[#ffc82c]">{proposal.brand}</span>
          <span className="text-right text-[9px] font-bold uppercase tracking-[0.12em] text-[#c8ccd7]">
            Ingénierie logicielle · UX/UI · Création numérique
          </span>
        </div>

        <div className="relative z-10 mt-14 max-w-[155mm]">
          <span className="inline-block border border-[#ffc82c]/55 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.09em] text-[#ffc82c]">
            Document de travail · Offre à confirmer
          </span>
          <h1 className="mt-8 font-achiko text-4xl font-black leading-tight text-white sm:text-5xl">
            Proposition <span className="text-[#ffc82c]">commerciale</span>
          </h1>
          <p className="mt-5 max-w-[125mm] text-base leading-relaxed text-[#d7d9e0]">
            {proposal.summary}
          </p>

          <div className="mt-12 border-l-2 border-[#ff3b56] py-1 pl-5">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#aeb3c0]">
              Proposition préparée pour
            </span>
            <strong className="mt-2 block font-achiko text-xl text-white">
              {proposal.clientName}
            </strong>
            <p className="mt-1 text-sm text-[#c8ccd7]">
              {proposal.clientShortName} · « {proposal.clientSlogan} »
            </p>
            <p className="mt-1 text-sm text-[#c8ccd7]">À l’attention de {proposal.recipient}</p>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-5">
            {[
              ["Référence", proposal.reference],
              ["Émise le", proposal.issuedAt],
              ["Validité indicative", proposal.validity],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[9px] font-bold uppercase tracking-widest text-[#aeb3c0]">{label}</dt>
                <dd className="mt-1 text-sm font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-5 text-[10px] text-[#c8ccd7]">
          <span>{proposal.creatorName} · {proposal.brand}</span>
          <span>{proposal.email} · {proposal.phone}</span>
        </div>
      </section>

      <section className="proposal-sheet relative mx-auto mb-5 min-h-[297mm] w-full overflow-hidden bg-white px-[17mm] py-[16mm] shadow-2xl print:mb-0 print:h-[297mm] print:min-h-0 print:w-[210mm] print:shadow-none">
        <SectionHeader brand={proposal.brand} label="01 · Compréhension du projet" />
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a57800]">{proposal.clientName}</p>
        <h2 className="font-achiko text-3xl leading-tight text-[#171923]">{proposal.projectOverviewTitle}</h2>
        <div className="mb-6 mt-4 h-1 w-20 bg-[#ffc82c]" />
        <p className="mb-7 max-w-[165mm] text-[11px] leading-relaxed text-[#5c6270]">{proposal.context}</p>

        <div className="border-l-4 border-[#10b981] bg-[#f2f8f5] px-5 py-4">
          <strong className="font-bold">{proposal.centralChallengeLabel}</strong>
          <p className="mt-2 text-[10px] leading-relaxed">{proposal.centralChallenge}</p>
        </div>

        <h3 className="mb-3 mt-7 font-achiko text-lg">{proposal.objectivesHeading}</h3>
        <div className="grid grid-cols-2 gap-3">
          {proposal.objectives.map((objective) => (
            <article key={objective.title} className={`min-h-[27mm] border border-[#d9dce3] border-t-4 ${objective.accent} bg-[#fafbfc] p-4`}>
              <strong className="text-[10px]">{objective.title}</strong>
              <p className="mt-2 text-[9px] leading-relaxed text-[#5c6270]">{objective.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 bg-[#0b0d18] px-5 py-4 text-[10px] leading-relaxed text-[#f8f9fa]">
          <strong className="text-[#ffc82c]">{proposal.orientationLabel}</strong>
          <p className="mt-1">{proposal.orientation}</p>
        </div>
        <PageFooter page="02">Proposition de travail · Tarifs et périmètre à valider</PageFooter>
      </section>

      <section className="proposal-sheet relative mx-auto mb-5 min-h-[297mm] w-full overflow-hidden bg-white px-[17mm] py-[16mm] shadow-2xl print:mb-0 print:h-[297mm] print:min-h-0 print:w-[210mm] print:shadow-none">
        <SectionHeader brand={proposal.brand} label="02 · Direction artistique & expérience" />
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a57800]">Phases 1 & 2</p>
        <h2 className="mb-3 font-achiko text-3xl leading-tight text-[#171923]">{proposal.designSectionTitle}</h2>
        <p className="mb-7 text-[10px] leading-relaxed text-[#5c6270]">Les choix visuels et fonctionnels seront définis à partir des publics de {proposal.clientShortName}, des contenus disponibles et des usages mobiles prioritaires.</p>

        {proposal.designPhases.map((phase) => <PhaseBlock key={phase.number} phase={phase} />)}

        <div className="grid grid-cols-2 gap-5">
          <div>
            <h3 className="mb-2 font-achiko text-base">{proposal.journeysHeading}</h3>
            <ul className="list-disc space-y-1 pl-5 text-[9px] leading-relaxed marker:text-[#b98a09]">
              {proposal.journeys.map((journey, index) => <li key={`${journey}-${index}`}>{journey}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-achiko text-base">{proposal.designPrinciplesHeading}</h3>
            <ul className="list-disc space-y-1 pl-5 text-[9px] leading-relaxed marker:text-[#b98a09]">
              {proposal.designPrinciples.map((principle) => <li key={principle}>{principle}</li>)}
            </ul>
          </div>
        </div>
        <PageFooter page="03">Proposition de travail · Tarifs et périmètre à valider</PageFooter>
      </section>

      <section className="proposal-sheet relative mx-auto mb-5 min-h-[297mm] w-full overflow-hidden bg-white px-[17mm] py-[16mm] shadow-2xl print:mb-0 print:h-[297mm] print:min-h-0 print:w-[210mm] print:shadow-none">
        <SectionHeader brand={proposal.brand} label="03 · Développement & modules" />
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a57800]">Phases 3 & 4</p>
        <h2 className="mb-3 font-achiko text-3xl leading-tight text-[#171923]">{proposal.developmentSectionTitle}</h2>
        <p className="mb-7 text-[10px] leading-relaxed text-[#5c6270]">{proposal.developmentIntroduction}</p>

        {proposal.developmentPhases.map((phase) => <PhaseBlock key={phase.number} phase={phase} />)}

        <div className="border border-[#e7d38d] bg-[#fffaf0] px-5 py-4 text-[9px] leading-relaxed text-[#574a25]">
          <strong>{proposal.implementationNotesLabel}</strong> {proposal.implementationNotes}
        </div>
        <h3 className="mb-2 mt-6 font-achiko text-base">{proposal.deploymentHeading}</h3>
        <p className="text-[9px] leading-relaxed text-[#252834]">{proposal.deployment}</p>
        <PageFooter page="04">Proposition de travail · Tarifs et périmètre à valider</PageFooter>
      </section>

      <section className="proposal-sheet relative mx-auto mb-5 min-h-[297mm] w-full overflow-hidden bg-white px-[17mm] py-[16mm] shadow-2xl print:mb-0 print:h-[297mm] print:min-h-0 print:w-[210mm] print:shadow-none">
        <SectionHeader brand={proposal.brand} label="04 · Budget & calendrier" />
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#a57800]">Estimation préliminaire</p>
        <h2 className="mb-3 font-achiko text-3xl leading-tight text-[#171923]">{proposal.budgetSectionTitle}</h2>
        <p className="mb-5 text-[9px] leading-relaxed text-[#5c6270]">{proposal.budgetIntroduction}</p>

        <table className="w-full border-collapse text-left text-[9px]">
          <thead>
            <tr className="border-b border-[#d9dce3] text-[8px] uppercase tracking-wider text-[#5c6270]">
              <th className="w-[35%] py-2 pr-2">Phase</th>
              <th className="py-2 pr-2">Livrables principaux</th>
              <th className="whitespace-nowrap py-2 text-right">Estimation</th>
            </tr>
          </thead>
          <tbody>
            {proposal.budgetItems.map((item) => (
              <tr key={item.phase} className="border-b border-[#d9dce3] align-top">
                <td className="py-3 pr-2 font-bold">{item.phase}</td>
                <td className="py-3 pr-2 text-[#5c6270]">{item.deliverables}</td>
                <td className="whitespace-nowrap py-3 text-right">{formatMoney(item.amount, proposal.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between gap-3 bg-[#0b0d18] px-5 py-3 text-white">
          <span className="text-[9px]">Budget total estimatif · À confirmer</span>
          <strong className="font-achiko text-xl text-[#ffc82c]">
            {formatMoney(total, proposal.currency)}
          </strong>
        </div>

        <h3 className="mb-2 mt-5 font-achiko text-base">{proposal.paymentHeading}</h3>
        <div className="grid grid-cols-3 gap-2">
          {proposal.payments.map((payment) => (
            <div key={payment.label} className="border border-[#d9dce3] p-3">
              <span className="text-[8px] text-[#5c6270]">{payment.label} · {payment.percentage}%</span>
              <strong className="my-1 block text-[11px]">
                {formatMoney(Math.round(total * payment.percentage / 100), proposal.currency)}
              </strong>
              <span className="text-[8px] leading-tight text-[#5c6270]">{payment.milestone}</span>
            </div>
          ))}
        </div>

        <h3 className="mb-1 mt-5 font-achiko text-base">{proposal.timelineTitle}</h3>
        <ul className="divide-y divide-[#d9dce3] text-[8px]">
          {proposal.timeline.map((item) => (
            <li key={item.period} className="grid grid-cols-[27mm_1fr] gap-3 py-2">
              <strong className="text-[#8c6700]">{item.period}</strong>
              <span>{item.description}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid grid-cols-2 gap-5 text-[8px]">
          <div className="border-t border-[#d9dce3] pt-2"><strong>{proposal.clientInputsHeading}</strong><p className="mt-1 text-[#5c6270]">{proposal.clientInputs}</p></div>
          <div className="border-t border-[#d9dce3] pt-2"><strong>{proposal.finalChecksHeading}</strong><p className="mt-1 text-[#5c6270]">{proposal.finalChecks}</p></div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-8 text-[8px] text-[#5c6270]">
          <div className="w-1/2 border-t border-[#737987] pt-2"><strong className="block text-[9px] text-[#171923]">Pour {proposal.clientShortName}</strong>Nom, date et signature</div>
          <div className="w-1/2 border-t border-[#737987] pt-2"><strong className="block text-[9px] text-[#171923]">{proposal.creatorName} · {proposal.brand}</strong>Bon pour accord après validation du devis final</div>
        </div>
        <PageFooter page="05">Contact · {proposal.email} · {proposal.phone}</PageFooter>
      </section>
    </div>
  );
}