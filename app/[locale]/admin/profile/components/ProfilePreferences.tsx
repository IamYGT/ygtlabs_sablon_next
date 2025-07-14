"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ProfilePreferences } from '../types/profile.types';

export default function ProfilePreferences() {
    const [preferences, setPreferences] = useState<ProfilePreferences>({
        theme: 'system',
        language: 'tr',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSavePreferences = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/profile/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to save preferences');
            }

            // Apply theme immediately
            if (preferences.theme !== 'system') {
                document.documentElement.classList.toggle('dark', preferences.theme === 'dark');
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);
            }

            toast.success('Preferences saved successfully');
        } catch (error) {
            toast.error('Failed to save preferences');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Theme Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Theme
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred theme for the application
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={preferences.theme}
                        onValueChange={(value) => setPreferences({ ...preferences, theme: value as 'light' | 'dark' | 'system' })}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <Label htmlFor="system">System</Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Language
                    </CardTitle>
                    <CardDescription>
                        Select your preferred language for the application
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={preferences.language}
                        onValueChange={(value) => setPreferences({ ...preferences, language: value as 'tr' | 'en' })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tr">Türkçe</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
                <CardContent className="pt-6">
                    <Button
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                        className="w-full"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Preferences'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// Export default ProfilePreferences