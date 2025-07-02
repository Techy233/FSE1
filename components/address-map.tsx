"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Navigation } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { google } from "google-maps"

interface AddressMapProps {
  coordinates?: { lat: number; lng: number }
  address?: string
  onLocationSelect: (coordinates: { lat: number; lng: number }, address: string) => void
  readOnly?: boolean
}

export default function AddressMap({ coordinates, address, onLocationSelect, readOnly = false }: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    // Default to a central location if no coordinates provided
    const defaultCenter = coordinates || { lat: 40.7128, lng: -74.006 } // New York City

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: coordinates ? 15 : 10,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    })

    setMap(mapInstance)

    // Add marker if coordinates are provided
    if (coordinates && coordinates.lat !== 0) {
      const markerInstance = new google.maps.Marker({
        position: coordinates,
        map: mapInstance,
        draggable: !readOnly,
        title: address || "Facility Location",
      })

      setMarker(markerInstance)

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>Facility Location</strong><br/>${address || "Selected Location"}</div>`,
      })

      markerInstance.addListener("click", () => {
        infoWindow.open(mapInstance, markerInstance)
      })

      if (!readOnly) {
        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition()
          if (position) {
            const newCoords = { lat: position.lat(), lng: position.lng() }
            reverseGeocode(newCoords)
          }
        })
      }
    }

    // Add click listener for selecting location (if not read-only)
    if (!readOnly) {
      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const newCoords = { lat: event.latLng.lat(), lng: event.latLng.lng() }
          addOrUpdateMarker(newCoords, mapInstance)
          reverseGeocode(newCoords)
        }
      })
    }

    setIsLoading(false)
  }, [coordinates, address, readOnly])

  const addOrUpdateMarker = (coords: { lat: number; lng: number }, mapInstance: google.maps.Map) => {
    if (marker) {
      marker.setPosition(coords)
    } else {
      const newMarker = new google.maps.Marker({
        position: coords,
        map: mapInstance,
        draggable: !readOnly,
        title: "Selected Location",
      })

      setMarker(newMarker)

      if (!readOnly) {
        newMarker.addListener("dragend", () => {
          const position = newMarker.getPosition()
          if (position) {
            const newCoords = { lat: position.lat(), lng: position.lng() }
            reverseGeocode(newCoords)
          }
        })
      }
    }
  }

  const reverseGeocode = async (coords: { lat: number; lng: number }) => {
    try {
      const geocoder = new google.maps.Geocoder()
      const response = await geocoder.geocode({ location: coords })

      if (response.results[0]) {
        const address = response.results[0].formatted_address
        onLocationSelect(coords, address)
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      onLocationSelect(coords, `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
    }
  }

  const searchAddress = async () => {
    if (!searchQuery.trim() || !map) return

    setIsLoading(true)
    try {
      const geocoder = new google.maps.Geocoder()
      const response = await geocoder.geocode({ address: searchQuery })

      if (response.results[0]) {
        const location = response.results[0].geometry.location
        const coords = { lat: location.lat(), lng: location.lng() }
        const address = response.results[0].formatted_address

        map.setCenter(coords)
        map.setZoom(15)
        addOrUpdateMarker(coords, map)

        if (!readOnly) {
          onLocationSelect(coords, address)
        }

        toast({
          title: "Location Found",
          description: `Found: ${address}`,
        })
      } else {
        toast({
          title: "Location Not Found",
          description: "Please try a different search term.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Geocoding failed:", error)
      toast({
        title: "Search Failed",
        description: "Unable to search for the address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation || !map) {
      toast({
        title: "Geolocation Not Available",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        map.setCenter(coords)
        map.setZoom(15)
        addOrUpdateMarker(coords, map)

        if (!readOnly) {
          reverseGeocode(coords)
        }

        setIsLoading(false)
        toast({
          title: "Location Found",
          description: "Using your current location.",
        })
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsLoading(false)
        toast({
          title: "Location Access Denied",
          description: "Unable to access your current location.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      {!readOnly && (
        <div className="p-4 border-b bg-gray-50 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search for an address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchAddress()}
              className="flex-1"
            />
            <Button onClick={searchAddress} disabled={isLoading} size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button onClick={getCurrentLocation} disabled={isLoading} variant="outline" size="sm">
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Click on the map to select a location, or drag the marker to adjust
          </p>
        </div>
      )}

      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full min-h-[300px]" />
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
