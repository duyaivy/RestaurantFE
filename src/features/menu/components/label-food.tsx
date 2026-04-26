"use client"

import React from 'react'
import { useTranslations } from 'next-intl'

type LabelFoodProps = {
    length: number
}

const LabelFood = ({ length }: LabelFoodProps) => {
    const t = useTranslations("dishes")

    return (
        <div className="px-5 pt-6 pb-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-linear-to-r from-amber-900/40 to-[#2c2820]" />
            <span className="text-[9px] tracking-[0.4em] text-amber-600/80 uppercase font-semibold px-1">
                {length} {t('dishesSuffix')}
            </span>
            <div className="h-px flex-1 bg-linear-to-l from-amber-900/40 to-[#2c2820]" />
        </div>
    )
}

export default LabelFood