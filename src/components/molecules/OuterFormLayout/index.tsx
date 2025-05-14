/////////// IMPORTS
///
import { ReactNode } from 'react';
import { Button } from '../../atoms/buttons/Button';
///
/////////// Types

///
type OuterFormLayout_TP = {
    children: ReactNode;
    header?: string | any;
    submitComponent?: ReactNode;
    leftComponent?: ReactNode;
    className?: string;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const OuterFormLayout = ({
    children,
    header,
    submitComponent,
    leftComponent,
    className,
}: OuterFormLayout_TP) => {
    /////////// VARIABLES
    ///

    ///
    /////////// CUSTOM HOOKS
    ///

    ///
    /////////// STATES
    ///

    ///
    /////////// SIDE EFFECTS
    ///

    /////////// FUNCTIONS | EVENTS | IF CASES
    ///

    ///
    return (
        <>
            <div className={`flex flex-col  ${className}`}>
                {header ? (
                    <>
                        <div className="flex justify-endcenter">
                            <h2 className="text-2xl font-bold mb-8">{header}</h2>
                            {leftComponent && leftComponent}
                        </div>
                    </>
                ) : (
                    ''
                )}

                <div className="rounded-lg">{children}</div>
                <div className="general-button dark:bg-dark-tertiary">
                    {!!submitComponent && submitComponent}
                </div>
            </div>
        </>
    );
};
