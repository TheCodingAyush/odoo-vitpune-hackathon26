import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react"

export interface TimelineStep {
  name: string;
  status: 'completed' | 'pending' | 'rejected' | 'upcoming';
  date: string;
  actor?: string;
  comment?: string;
}

interface ExpenseTimelineProps {
  steps: TimelineStep[];
  reason?: string;
}

export function ExpenseTimeline({ steps, reason }: ExpenseTimelineProps) {
  return (
    <div className="pt-4 border-t border-border/50">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Approval Timeline</h4>
      <div className="relative ml-3 space-y-6">
        {/* Vertical connecting line */}
        <div className="absolute top-2 bottom-6 left-0 w-0.5 bg-border -ml-[1px]" />

        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isPending = step.status === 'pending';
          const isRejected = step.status === 'rejected';
          const isUpcoming = step.status === 'upcoming';
          
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-6"
            >
              {/* Node Icon */}
              <div className={`absolute -left-[9px] top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-background z-10 ${
                isCompleted ? 'bg-success text-success-foreground' : 
                isRejected ? 'bg-destructive text-destructive-foreground' : 
                isPending ? 'bg-warning text-warning-foreground border border-warning shadow-[0_0_8px_rgba(var(--color-warning-base),0.6)] animate-pulse' : 
                'bg-muted border border-muted-foreground/30 text-muted-foreground'
              }`}>
                {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                {isRejected && <XCircle className="w-3 h-3" />}
                {isPending && <Clock className="w-3 h-3" />}
                {isUpcoming && <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1 -mt-1.5">
                <div className="flex items-center justify-between">
                  <h5 className={`text-sm font-semibold ${isUpcoming ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {step.name}
                  </h5>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                    {step.date}
                  </span>
                </div>
                
                {step.actor && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-bold">
                      {step.actor.charAt(0)}
                    </span>
                    {step.actor}
                  </p>
                )}
                
                {step.comment && (
                  <p className="text-xs text-foreground/80 bg-accent/50 p-2 rounded-md mt-1 italic border-l-2 border-primary/30">
                    "{step.comment}"
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {reason && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-5 p-3.5 bg-destructive/10 border-l-4 border-destructive text-destructive text-sm rounded-r-lg flex gap-3 items-start shadow-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-xs uppercase tracking-wider mb-0.5 text-destructive/80">Rejection Reason</p>
            <p className="font-medium leading-relaxed">{reason}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
