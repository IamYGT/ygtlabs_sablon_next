'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, MapPin, Smartphone, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface ApiActivityItem {
    id: string;
    action?: string;
    isSuccessful?: boolean;
    ipAddress: string | null;
    location: string | null;
    userAgent: string | null;
    date: string;
    type: 'activity' | 'login';
}

interface Activity {
  id: string;
  event?: string;
  isSuccessful?: boolean;
  ipAddress: string | null;
  location: string | null;
  device: string | null;
  timestamp: string;
  type: 'activity' | 'login';
}

interface EventBadgeProps {
    type: 'activity' | 'login';
    event?: string;
    isSuccessful?: boolean;
}

const EventBadge = ({ type, event, isSuccessful }: EventBadgeProps) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let text: string = type;

  if (type === 'login') {
    variant = isSuccessful ? 'default' : 'destructive';
    text = isSuccessful ? 'Giriş Başarılı' : 'Giriş Başarısız';
  } else if (type === 'activity') {
    if (event?.includes('Güncellendi')) variant = 'secondary';
    if (event?.includes('Değiştirildi')) variant = 'destructive';
    text = event || 'Aktivite';
  }

  return <Badge variant={variant}>{text}</Badge>;
};

export default function ActivityReportPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActivities = async (page: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/customer/activity?page=${page}&limit=10`);
        if (!response.ok) {
          throw new Error('Aktivite verileri alınamadı.');
        }
        const { data, totalPages: newTotalPages } = await response.json();
        
        const formattedData: Activity[] = data.map((item: ApiActivityItem) => ({
            id: item.id,
            event: item.action || (item.isSuccessful ? 'Giriş Başarılı' : 'Giriş Başarısız'),
            isSuccessful: item.isSuccessful,
            ipAddress: item.ipAddress,
            location: item.location || 'Bilinmiyor',
            device: item.userAgent || 'Bilinmiyor',
            timestamp: format(new Date(item.date), 'dd MMMM yyyy, HH:mm', { locale: tr }),
            type: item.type
        }));

        setActivities(formattedData);
        setTotalPages(newTotalPages);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities(currentPage);
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Aktivite Raporu</h1>
        <p className="text-muted-foreground">Hesap aktivitelerinizi ve oturum geçmişinizi görüntüleyin.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Son Aktiviteler
          </CardTitle>
          <CardDescription>
            Hesabınızda gerçekleşen son olayların bir listesi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Olay</TableHead>
                    <TableHead className="hidden md:table-cell">IP Adresi</TableHead>
                    <TableHead className="hidden lg:table-cell">Konum</TableHead>
                    <TableHead className="hidden lg:table-cell">Cihaz</TableHead>
                    <TableHead className="text-right">Zaman</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        <EventBadge type={activity.type} event={activity.event} isSuccessful={activity.isSuccessful} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{activity.ipAddress}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {activity.location}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          {activity.device}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        <div className="flex items-center justify-end gap-2">
                          <Clock className="h-4 w-4" />
                          {activity.timestamp}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-muted-foreground">
                  Sayfa {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}