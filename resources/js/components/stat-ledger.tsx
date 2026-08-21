import { Separator } from '@/components/ui/separator';

export type Stat = { value: string; label: string };

export function StatLedger({ stats }: { stats: Stat[] }) {
    return (
        <dl className="flex flex-wrap items-stretch gap-x-6 gap-y-4 sm:gap-x-8">
            {stats.map((s, i) => (
                <div key={s.label} className="flex items-stretch gap-x-6 sm:gap-x-8">
                    <div>
                        <dt className="font-mono text-[11px] tracking-wide text-neutral-400 uppercase">{s.label}</dt>
                        <dd className="mt-1 font-mono text-2xl font-medium text-[#101114] tabular-nums">{s.value}</dd>
                    </div>
                    {i < stats.length - 1 && <Separator orientation="vertical" className="hidden h-auto sm:block" />}
                </div>
            ))}
        </dl>
    );
}