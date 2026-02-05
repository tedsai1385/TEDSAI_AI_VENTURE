import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    };
    secondaryActions?: Array<{
        label: string;
        onClick: () => void;
        icon?: LucideIcon;
    }>;
    helpLink?: {
        label: string;
        href: string;
    };
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    primaryAction,
    secondaryActions,
    helpLink,
}: EmptyStateProps) {
    const PrimaryIcon = primaryAction?.icon;

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-cortex-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-cortex-primary" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-heading font-bold text-white mb-2">
                {title}
            </h3>
            <p className="text-dark-text-secondary max-w-md mb-8">
                {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {primaryAction && (
                    <Button
                        onClick={primaryAction.onClick}
                        className="bg-cortex-primary hover:bg-cortex-primary-dark"
                    >
                        {PrimaryIcon && <PrimaryIcon className="w-4 h-4 mr-2" />}
                        {primaryAction.label}
                    </Button>
                )}

                {secondaryActions?.map((action, idx) => {
                    const SecondaryIcon = action.icon;
                    return (
                        <Button
                            key={idx}
                            onClick={action.onClick}
                            variant="outline"
                            className="border-dark-border hover:bg-dark-surface-elevated"
                        >
                            {SecondaryIcon && <SecondaryIcon className="w-4 h-4 mr-2" />}
                            {action.label}
                        </Button>
                    );
                })}
            </div>

            {/* Help Link */}
            {helpLink && (
                <a
                    href={helpLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cortex-primary hover:text-cortex-primary-light transition-colors"
                >
                    {helpLink.label} →
                </a>
            )}
        </div>
    );
}
