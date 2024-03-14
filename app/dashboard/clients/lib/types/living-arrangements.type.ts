export type LivingArrangementType = 'inpatient' | 'outpatientEquivalent' | 'otherLivingArrangement';

export type LivingArrangement = { type: LivingArrangementType; startedAt: Date; endedAt?: Date };
