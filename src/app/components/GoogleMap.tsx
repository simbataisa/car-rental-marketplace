'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface Dealer {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  openHours: string;
  lat: number;
  lng: number;
  available: boolean;
  type: 'automated' | 'traditional';
  region: 'north' | 'central' | 'south';
  city: string;
}

interface GoogleMapProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onDealerSelect: (dealer: Dealer) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
}

interface MapComponentProps {
  dealers: Dealer[];
  selectedDealer: Dealer | null;
  onDealerSelect: (dealer: Dealer) => void;
  center: { lat: number; lng: number };
  zoom: number;
  userLocation?: { lat: number; lng: number } | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  dealers,
  selectedDealer,
  onDealerSelect,
  center,
  zoom,
  userLocation,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [currentUserLocation, setCurrentUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationButton, setLocationButton] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
        restriction: {
          latLngBounds: {
            north: 23.5,
            south: 8.0,
            west: 102.0,
            east: 110.0,
          },
          strictBounds: false,
        },
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
      });
      
      // Add geolocation control
      const newLocationButton = document.createElement('button');
      newLocationButton.textContent = '📍';
      newLocationButton.classList.add('custom-map-control-button');
      newLocationButton.style.cssText = `
        background-color: #fff;
        border: 2px solid #fff;
        border-radius: 3px;
        box-shadow: 0 2px 6px rgba(0,0,0,.3);
        color: rgb(25,25,25);
        cursor: pointer;
        font-family: Roboto,Arial,sans-serif;
        font-size: 16px;
        line-height: 38px;
        margin: 8px 0 22px;
        padding: 0 5px;
        text-align: center;
        width: 40px;
        height: 40px;
        transition: all 0.2s ease;
      `;
      newLocationButton.title = 'Find My Location';
      setLocationButton(newLocationButton);
      
      const updateButtonState = (isActive: boolean) => {
        if (newLocationButton) {
          if (isActive) {
            newLocationButton.style.backgroundColor = '#4285F4';
            newLocationButton.style.color = '#fff';
            newLocationButton.title = 'Re-center to My Location';
          } else {
            newLocationButton.style.backgroundColor = '#fff';
            newLocationButton.style.color = 'rgb(25,25,25)';
            newLocationButton.title = 'Find My Location';
          }
        }
      };
      
      newLocationButton.addEventListener('click', () => {
        // If we already have user location, just re-center
        if (currentUserLocation) {
          newMap.setCenter(currentUserLocation);
          newMap.setZoom(16);
          updateButtonState(true);
          return;
        }
        
        // Otherwise, get current location
        if (navigator.geolocation) {
          newLocationButton.textContent = '⏳';
          newLocationButton.style.cursor = 'wait';
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setCurrentUserLocation(pos);
              newMap.setCenter(pos);
              newMap.setZoom(16);
              
              // Create or update user location marker
              if (userMarker) {
                userMarker.setPosition(pos);
              } else {
                const marker = new window.google.maps.Marker({
                  position: pos,
                  map: newMap,
                  title: 'Your Location',
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#fff" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="#fff"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(24, 24),
                    anchor: new window.google.maps.Point(12, 12),
                  },
                });
                setUserMarker(marker);
              }
              
              // Reset button appearance and update state
              newLocationButton.textContent = '📍';
              newLocationButton.style.cursor = 'pointer';
              updateButtonState(true);
            },
            () => {
              newLocationButton.textContent = '📍';
              newLocationButton.style.cursor = 'pointer';
              alert('Error: The Geolocation service failed.');
            }
          );
        } else {
          alert('Error: Your browser doesn\'t support geolocation.');
        }
      });
      
      // Add map event listeners to detect when user pans/zooms away
      newMap.addListener('center_changed', () => {
        if (currentUserLocation && locationButton) {
          const mapCenter = newMap.getCenter();
          if (mapCenter) {
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(currentUserLocation.lat, currentUserLocation.lng),
              mapCenter
            );
            // If user is more than 100 meters away from their location, show inactive state
            updateButtonState(distance < 100);
          }
        }
      });
      
      newMap.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(newLocationButton);
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  // Handle map resize and recentering
  useEffect(() => {
    if (map) {
      const handleResize = () => {
        window.google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
        map.setZoom(zoom);
      };
      
      // Trigger resize after a short delay to ensure container is properly sized
      const timeoutId = setTimeout(handleResize, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [map, center, zoom]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Create new markers
      const newMarkers = dealers.map((dealer) => {
        const getMarkerIcon = () => {
          const isSelected = selectedDealer?.id === dealer.id;
          const isAutomated = dealer.type === 'automated';
          
          if (!dealer.available) {
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="14" fill="#EF4444" stroke="white" stroke-width="3"/>
                <circle cx="18" cy="18" r="7" fill="white"/>
                <text x="18" y="22" text-anchor="middle" fill="#EF4444" font-size="10" font-weight="bold">✕</text>
              </svg>
            `);
          }
          
          if (isAutomated) {
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="14" fill="${isSelected ? '#3B82F6' : '#8B5CF6'}" stroke="white" stroke-width="3"/>
                <circle cx="18" cy="18" r="7" fill="white"/>
                <text x="18" y="22" text-anchor="middle" fill="${isSelected ? '#3B82F6' : '#8B5CF6'}" font-size="12" font-weight="bold">⚡</text>
              </svg>
            `);
          } else {
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="18" r="14" fill="${isSelected ? '#3B82F6' : '#10B981'}" stroke="white" stroke-width="3"/>
                <circle cx="18" cy="18" r="7" fill="white"/>
                <text x="18" y="22" text-anchor="middle" fill="${isSelected ? '#3B82F6' : '#10B981'}" font-size="10" font-weight="bold">🏢</text>
              </svg>
            `);
          }
        };
        
        const marker = new window.google.maps.Marker({
          position: { lat: dealer.lat, lng: dealer.lng },
          map,
          title: dealer.name,
          icon: {
            url: getMarkerIcon(),
            scaledSize: new window.google.maps.Size(36, 36),
            anchor: new window.google.maps.Point(18, 18),
          },
        });

        // Add click listener
        marker.addListener('click', () => {
          if (dealer.available) {
            // Zoom to dealer location
            map.setCenter({ lat: dealer.lat, lng: dealer.lng });
            map.setZoom(16);
            onDealerSelect(dealer);
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 280px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${dealer.name}</h3>
                <span style="
                  display: inline-flex;
                  align-items: center;
                  padding: 2px 6px;
                  border-radius: 8px;
                  font-size: 10px;
                  font-weight: bold;
                  ${dealer.type === 'automated' 
                    ? 'background-color: #DBEAFE; color: #1E40AF;' 
                    : 'background-color: #F3F4F6; color: #374151;'
                  }
                ">
                  ${dealer.type === 'automated' ? '⚡ Smart Depot' : '🏢 Traditional'}
                </span>
              </div>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">${dealer.address}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">📞 ${dealer.phone}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">⭐ ${dealer.rating} • ${dealer.distance}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #666;">🕒 ${dealer.openHours}</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">📍 ${dealer.city}, ${dealer.region.charAt(0).toUpperCase() + dealer.region.slice(1)} Vietnam</p>
              <div style="text-align: center;">
                <span style="
                  display: inline-block;
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: bold;
                  ${dealer.available 
                    ? 'background-color: #D1FAE5; color: #065F46;' 
                    : 'background-color: #FEE2E2; color: #991B1B;'
                  }
                ">
                  ${dealer.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, dealers, selectedDealer, onDealerSelect]);

  // Add user location marker
  useEffect(() => {
    if (map && userLocation) {
      // Clear existing user marker
      if (userMarker) {
        userMarker.setMap(null);
      }

      // Create user location marker
      const newUserMarker = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
          anchor: new window.google.maps.Point(12, 12),
        },
      });

      // Add info window for user location
      const userInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; text-align: center;">
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #3B82F6;">📍 Your Location</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">Current position</p>
          </div>
        `,
      });

      newUserMarker.addListener('click', () => {
        userInfoWindow.open(map, newUserMarker);
      });

      setUserMarker(newUserMarker);
    }
  }, [map, userLocation]);

  return (
    <div 
      ref={ref} 
      style={{ 
        width: '100%', 
        height: '68%', 
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        position: 'relative'
      }} 
    />
  );
};

const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-medium">Failed to load Google Maps</p>
            <p className="text-red-500 text-sm mt-2">Please check your API key configuration</p>
          </div>
        </div>
      );
    case Status.SUCCESS:
      return <></>;
  }
};

export const GoogleMap: React.FC<GoogleMapProps> = ({
  dealers,
  selectedDealer,
  onDealerSelect,
  center = { lat: 14.0583, lng: 108.2772 }, // Vietnam center
  zoom = 6,
  userLocation,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center">
          <div className="text-yellow-500 text-4xl mb-4">🔑</div>
          <p className="text-yellow-600 font-medium">Google Maps API Key Required</p>
          <p className="text-yellow-500 text-sm mt-2">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper 
      key="google-maps-vi-VN"
      apiKey={apiKey} 
      render={render}
      language="vi"
      region="VN"
    >
      <MapComponent
        dealers={dealers}
        selectedDealer={selectedDealer}
        onDealerSelect={onDealerSelect}
        center={center}
        zoom={zoom}
        userLocation={userLocation}
      />
    </Wrapper>
  );
};