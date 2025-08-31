'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  allDay?: boolean;
}

function EventDialog({ event, onSave, children }: { event?: Partial<CalendarEvent>, onSave: (event: Omit<CalendarEvent, 'id'>) => Promise<void>, children: React.ReactNode }) {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(event?.startDate ? format(new Date(event.startDate), "yyyy-MM-dd'T'HH:mm") : '');
  const [endDate, setEndDate] = useState(event?.endDate ? format(new Date(event.endDate), "yyyy-MM-dd'T'HH:mm") : '');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSave({ title, description, startDate, endDate });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event?.id ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start-date">Başlangıç Tarihi</Label>
            <Input id="start-date" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Bitiş Tarihi</Label>
            <Input id="end-date" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">İptal</Button></DialogClose>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async (month: Date) => {
    setIsLoading(true);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    try {
      const response = await fetch(`/api/customer/calendar?startDate=${start.toISOString()}&endDate=${end.toISOString()}`);
      if (!response.ok) throw new Error('Etkinlikler alınamadı.');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth]);

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    const toastId = toast.loading('Etkinlik kaydediliyor...');
    try {
      const response = await fetch('/api/customer/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Etkinlik kaydedilemedi.');
      toast.success('Etkinlik başarıyla oluşturuldu.', { id: toastId });
      fetchEvents(currentMonth); // Listeyi yenile
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.', { id: toastId });
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) return;
    const toastId = toast.loading('Etkinlik siliniyor...');
    try {
        const response = await fetch(`/api/customer/calendar/${eventId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Etkinlik silinemedi.');
        toast.success('Etkinlik başarıyla silindi.', { id: toastId });
        fetchEvents(currentMonth); // Listeyi yenile
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.', { id: toastId });
    }
  };

  const eventsOnSelectedDate = date ? events.filter(e => new Date(e.startDate).toDateString() === date.toDateString()) : [];
  const eventDays = events.map(e => new Date(e.startDate));

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Takvim</h1>
          <p className="text-muted-foreground">Etkinliklerinizi, randevularınızı ve önemli tarihleri yönetin.</p>
        </div>
        <EventDialog onSave={handleSaveEvent}>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Etkinlik</Button>
        </EventDialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                className="rounded-md"
                locale={tr}
                modifiers={{ hasEvent: eventDays }}
                modifiersClassNames={{
                  hasEvent: 'has-event',
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{date ? format(date, 'dd MMMM yyyy', { locale: tr }) : 'Tarih Seçin'}</CardTitle>
              <CardDescription>Seçilen tarihteki etkinlikler</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> :
               eventsOnSelectedDate.length > 0 ? (
                <ul className="space-y-3">
                  {eventsOnSelectedDate.map(event => (
                    <li key={event.id} className="flex justify-between items-center p-2 rounded-md bg-muted">
                        <div>
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Edit functionality can be added here with another dialog */}
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteEvent(event.id)}><Trash className="h-4 w-4" /></Button>
                        </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Seçilen tarihte etkinlik yok.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}