"use client"
import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import apiClient from "@/lib/axios";
import { handleError } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  id: number;
  name: string;
  place: string;
}

interface SelectSearchFormProps {
  onFilterChange: (filters: {
    dari?: number;
    ke?: number;
    dateRange?: DateRange;
  }) => void;
}

const SelectSearchForm = ({ onFilterChange }: SelectSearchFormProps) => {
  const [dari, setDari] = useState<number>();
  const [ke, setKe] = useState<number>();
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  const [locations, setLocations] = useState<Location[]>([]);
  const [openDari, setOpenDari] = useState(false);
  const [openKe, setOpenKe] = useState(false);
  const [searchDari, setSearchDari] = useState("");
  const [searchKe, setSearchKe] = useState("");
  const [prevFilters, setPrevFilters] = useState<string>("");

  // Fetch master data
  const fetchMasterData = async () => {
    try {
      const response = await apiClient.get("/api/admin/schedule-master-update");
      if (response.data) {
        setLocations(response.data.data.locations);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  // Effect untuk update filter hanya jika dari dan ke sudah dipilih
  useEffect(() => {
    if (!dari || !ke) return;

    const currentFilters = JSON.stringify({ dari, ke, dateRange: date });
    if (currentFilters === prevFilters) return;

    setPrevFilters(currentFilters);
    onFilterChange({ dari, ke, dateRange: date });
  }, [dari, ke, date, onFilterChange, prevFilters]);

  const getFilteredLocations = (search: string) => {
    if (!search.trim()) {
      return locations.slice(0, 10);
    }
    return locations
      .filter(location => 
        `${location.name} ${location.place}`.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 10);
  };

  const formatLocationDisplay = (location: Location | undefined) => {
    if (!location) return "";
    return (
      <div className="flex items-center gap-1 truncate">
        <span className="font-medium">{location.name}</span>
        <span className="text-gray-400 mx-1">-</span>
        <span className="text-gray-600">{location.place}</span>
      </div>
    );
  };

  const handleDateChange = useCallback((newDate: DateRange | undefined) => {
    setDate(newDate || { from: new Date(), to: addDays(new Date(), 7) });
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Dari</Label>
          <Popover open={openDari} onOpenChange={setOpenDari}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDari}
                className="w-full justify-between"
              >
                <div className="flex-1 text-left truncate">
                  {dari ? formatLocationDisplay(locations.find(loc => loc.id === dari)) : 
                    <span className="text-gray-500">Pilih kota keberangkatan</span>
                  }
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Cari kota atau terminal..." 
                  value={searchDari}
                  onValueChange={setSearchDari}
                />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {getFilteredLocations(searchDari).map((location) => (
                    <CommandItem
                      key={location.id}
                      value={`${location.name} ${location.place}`}
                      onSelect={() => {
                        setDari(location.id);
                        setOpenDari(false);
                        setSearchDari("");
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            dari === location.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{location.name}</span>
                          <span className="text-xs text-gray-600">{location.place}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Ke</Label>
          <Popover open={openKe} onOpenChange={setOpenKe}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openKe}
                className="w-full justify-between"
              >
                <div className="flex-1 text-left truncate">
                  {ke ? formatLocationDisplay(locations.find(loc => loc.id === ke)) : 
                    <span className="text-gray-500">Pilih kota tujuan</span>
                  }
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput 
                  placeholder="Cari kota atau terminal..." 
                  value={searchKe}
                  onValueChange={setSearchKe}
                />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {getFilteredLocations(searchKe).map((location) => (
                    <CommandItem
                      key={location.id}
                      value={`${location.name} ${location.place}`}
                      onSelect={() => {
                        setKe(location.id);
                        setOpenKe(false);
                        setSearchKe("");
                      }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            ke === location.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{location.name}</span>
                          <span className="text-xs text-gray-600">{location.place}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Tanggal Keberangkatan</Label>
          <DatePickerWithRange 
            date={date} 
            onDateChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectSearchForm; 