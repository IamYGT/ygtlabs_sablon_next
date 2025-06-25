'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Corporate Professional chart component - Banking/Finance style
export function StatsChart() {
    const t = useTranslations('AdminDashboard');

    const chartData = [
        { month: t('chart.months.jan'), revenue: 2.1, transactions: 1.8 },
        { month: t('chart.months.feb'), revenue: 2.4, transactions: 2.1 },
        { month: t('chart.months.mar'), revenue: 2.8, transactions: 2.5 },
        { month: t('chart.months.apr'), revenue: 2.6, transactions: 2.3 },
        { month: t('chart.months.may'), revenue: 3.2, transactions: 2.9 },
        { month: t('chart.months.jun'), revenue: 3.8, transactions: 3.4 },
    ];

    const maxRevenue = Math.max(...chartData.map(d => d.revenue));
    const maxTransactions = Math.max(...chartData.map(d => d.transactions));

    return (
        <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('chart.title')}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                            {t('chart.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+18.7%</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-6">
                    {/* Corporate Chart Legend */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                            <span className="text-gray-600 dark:text-slate-300">{t('chart.revenue')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm"></div>
                            <span className="text-gray-600 dark:text-slate-300">{t('chart.transactions')}</span>
                        </div>
                    </div>

                    {/* Corporate Bar Chart */}
                    <div className="space-y-4">
                        {chartData.map((data, index) => (
                            <div key={data.month} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700 dark:text-slate-300 w-8">
                                        {data.month}
                                    </span>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                                        <span>₺{data.revenue}M {t('chart.revenueLabel')}</span>
                                        <span>₺{data.transactions}M {t('chart.transactionLabel')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Revenue bar */}
                                    <div className="flex-1 bg-gray-200 dark:bg-slate-700/60 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                            style={{
                                                width: `${(data.revenue / maxRevenue) * 100}%`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        ></div>
                                    </div>
                                    {/* Transactions bar */}
                                    <div className="flex-1 bg-gray-200 dark:bg-slate-700/60 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                                            style={{
                                                width: `${(data.transactions / maxTransactions) * 100}%`,
                                                animationDelay: `${index * 100 + 50}ms`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Corporate Summary Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700/60">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₺{chartData[chartData.length - 1].revenue}M
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                                {t('chart.thisMonthRevenue')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₺{chartData[chartData.length - 1].transactions}M
                            </div>
                            <div className="text-xs text-gray-500 dark:text-slate-400">
                                {t('chart.thisMonthTransactions')}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
