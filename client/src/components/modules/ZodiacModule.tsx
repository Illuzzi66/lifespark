import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getZodiacInfo, saveZodiacInfo } from '@/lib/local-storage';
import { fetchZodiacInfo } from '@/lib/zodiac';
import { ZodiacInfo } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

export const ZodiacModule: React.FC = () => {
  const [zodiacInfo, setZodiacInfo] = useState<ZodiacInfo>({ month: '', day: '' });
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generate arrays for month and day options
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];
  
  // Days array for day selection
  const getDaysInMonth = (month: number): number => {
    if (month === 2) return 29; // February, including leap year
    if ([4, 6, 9, 11].includes(month)) return 30;
    return 31;
  };
  
  const days = selectedMonth 
    ? Array.from({ length: getDaysInMonth(parseInt(selectedMonth)) }, (_, i) => ({
        value: (i + 1).toString(),
        label: (i + 1).toString()
      }))
    : [];

  // Load zodiac info on initial load
  useEffect(() => {
    const savedInfo = getZodiacInfo();
    setZodiacInfo(savedInfo);
    
    if (savedInfo.month) {
      setSelectedMonth(savedInfo.month.toString());
    }
    if (savedInfo.day) {
      setSelectedDay(savedInfo.day.toString());
    }
  }, []);

  const updateZodiac = async () => {
    if (!selectedMonth || !selectedDay) {
      toast({
        title: "Missing information",
        description: "Please select both month and day",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Track zodiac lookup attempt
    trackEvent('lookup_zodiac', 'engagement', `${selectedMonth}-${selectedDay}`);
    
    try {
      const month = parseInt(selectedMonth);
      const day = parseInt(selectedDay);
      
      const info = await fetchZodiacInfo(month, day);
      
      // Save to local storage
      saveZodiacInfo(info);
      setZodiacInfo(info);
      
      // Track successful zodiac lookup
      if (info.sign) {
        trackEvent('zodiac_found', 'engagement', info.sign);
      }
      
      toast({
        title: "Zodiac Updated",
        description: `Your zodiac sign is ${info.sign}`,
      });
    } catch (error) {
      // Track error
      trackEvent('zodiac_error', 'error', error instanceof Error ? error.message : 'unknown');
      
      toast({
        title: "Error",
        description: "Could not fetch zodiac information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold">Your Zodiac</CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        {zodiacInfo.sign ? (
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-600 text-2xl font-bold">
              {zodiacInfo.sign.charAt(0)}
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-5">
              <h3 className="text-base font-semibold text-center sm:text-left">{zodiacInfo.sign}</h3>
              {zodiacInfo.month && zodiacInfo.day && (
                <p className="text-sm text-gray-500 mt-1">{`${months.find(m => m.value === zodiacInfo.month.toString())?.label} ${zodiacInfo.day}`}</p>
              )}
              
              <div className="mt-3 text-sm">
                {zodiacInfo.traits && (
                  <p className="mb-2">
                    {zodiacInfo.sign} is known for being {zodiacInfo.traits.slice(0, 3).join(', ')}, and {zodiacInfo.traits[3] || 'creative'}.
                  </p>
                )}
                {zodiacInfo.motivation && (
                  <p className="font-medium">
                    Daily motivation: <span className="italic">{`"${zodiacInfo.motivation}"`}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-4">Enter your birthday to see your zodiac sign</p>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium mb-2">Update your birthday:</p>
          <div className="flex space-x-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              className="px-4 py-2 bg-primary text-white"
              onClick={updateZodiac}
              disabled={loading}
            >
              {loading ? "Loading..." : "Update"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZodiacModule;
