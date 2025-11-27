import { useState, useEffect } from "react";
import { useGetCitiesQuery } from "../services/locationApi";

export const useDefaultCity = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const { data: citiesData } = useGetCitiesQuery({ page: 1, limit: 100 });

  useEffect(() => {
    const savedCityId = localStorage.getItem("selectedCityId");

    if (savedCityId) {
      setSelectedCityId(savedCityId);
    } else if (citiesData?.data && citiesData.data.length > 0) {
      // Set first city with most properties as default
      const defaultCity = [...citiesData.data].sort(
        (a, b) => (b._count?.properties || 0) - (a._count?.properties || 0)
      )[0];
      setSelectedCityName(defaultCity.name);
      setSelectedCityId(defaultCity.id);
      localStorage.setItem("selectedCityId", defaultCity.id);
    }
  }, [citiesData]);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const selectedCityName =
      citiesData?.data.find((city) => city.id === cityId)?.name || "";
    setSelectedCityName(selectedCityName);

    localStorage.setItem("selectedCityId", cityId);
  };

  return { selectedCityId, selectedCityName, handleCityChange };
};
