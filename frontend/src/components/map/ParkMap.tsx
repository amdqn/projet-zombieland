import { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, CircularProgress, Alert } from '@mui/material';
import { colors } from '../../theme';
import type { MapData, MapPoint } from '../../@types/map';
import type { Attraction } from '../../@types/attraction';
import type { Activity } from '../../@types/activity';
import type { PointOfInterest } from '../../@types/pointOfInterest';
import { WaitTime } from '../common/WaitTime/WaitTime';

// Fix des icônes Leaflet par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ParkMapProps {
  data: MapData | null;
  loading: boolean;
  error: string | null;
  selectedTypes: string[];
  selectedCategories: number[];
  searchQuery: string;
}

export function ParkMap({ data, loading, error, selectedTypes, selectedCategories, searchQuery }: ParkMapProps) {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);

  // Convertir les données en points de carte et appliquer les filtres
  useEffect(() => {
    if (!data) return;

    const points: MapPoint[] = [];

    // Ajouter les attractions (hors restauration)
    if (selectedTypes.includes('attraction')) {
      data.attractions
        .filter((a: Attraction) => a.latitude && a.longitude)
        .filter((a: Attraction) => a.category?.name !== 'Restauration') // Exclure la restauration
        .filter((a: Attraction) =>
          selectedCategories.length === 0 || selectedCategories.includes(a.category_id)
        )
        .filter((a: Attraction) => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return a.name.toLowerCase().includes(query) ||
                 a.description?.toLowerCase().includes(query);
        })
        .forEach((attraction: Attraction) => {
          points.push({
            id: attraction.id,
            name: attraction.name,
            latitude: Number(attraction.latitude),
            longitude: Number(attraction.longitude),
            type: 'attraction',
            description: attraction.description,
            image_url: attraction.image_url,
            thrill_level: attraction.thrill_level,
            duration: attraction.duration,
            category: attraction.category,
            wait_time: attraction.wait_time,
          });
        });
    }

    // Ajouter les restaurants (attractions de catégorie Restauration)
    if (selectedTypes.includes('restaurant')) {
      data.attractions
        .filter((a: Attraction) => a.latitude && a.longitude)
        .filter((a: Attraction) => a.category?.name === 'Restauration') // Uniquement la restauration
        .filter((a: Attraction) => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return a.name.toLowerCase().includes(query) ||
                 a.description?.toLowerCase().includes(query);
        })
        .forEach((restaurant: Attraction) => {
          points.push({
            id: restaurant.id,
            name: restaurant.name,
            latitude: Number(restaurant.latitude),
            longitude: Number(restaurant.longitude),
            type: 'restaurant',
            description: restaurant.description,
            image_url: restaurant.image_url,
            category: restaurant.category,
          });
        });
    }

    // Ajouter les activités
    if (selectedTypes.includes('activity')) {
      data.activities
        .filter((a: Activity) => a.latitude && a.longitude)
        .filter((a: Activity) =>
          selectedCategories.length === 0 || selectedCategories.includes(a.category_id)
        )
        .filter((a: Activity) => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return a.name.toLowerCase().includes(query) ||
                 a.description?.toLowerCase().includes(query);
        })
        .forEach((activity: Activity) => {
          points.push({
            id: activity.id,
            name: activity.name,
            latitude: Number(activity.latitude),
            longitude: Number(activity.longitude),
            type: 'activity',
            description: activity.description,
            image_url: activity.image_url,
            thrill_level: activity.thrill_level,
            duration: activity.duration,
            category: activity.category,
            wait_time: activity.wait_time,
          });
        });
    }

    // Ajouter les POI (toilettes, boutiques)
    if (selectedTypes.includes('poi')) {
      data.pois.forEach((poi: PointOfInterest) => {
        points.push({
          id: poi.id,
          name: poi.name,
          latitude: Number(poi.latitude),
          longitude: Number(poi.longitude),
          type: 'poi',
          description: poi.description || undefined,
          icon: poi.icon || undefined,
          poi_type: poi.type,
        });
      });
    }

    setMapPoints(points);
  }, [data, selectedTypes, selectedCategories, searchQuery]);

  // Créer des icônes personnalisées selon le type
  const createCustomIcon = (point: MapPoint) => {
    let color = colors.primaryGreen;
    let svgContent = '';

    if (point.type === 'attraction') {
      color = colors.primaryRed;
      // Icône manège / roue (ferris wheel)
      svgContent = '<circle cx="12" cy="12" r="9" fill="none" stroke="white" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="white"/><line x1="12" y1="3" x2="12" y2="21" stroke="white" stroke-width="1.5"/><line x1="3" y1="12" x2="21" y2="12" stroke="white" stroke-width="1.5"/><circle cx="12" cy="5" r="1.5" fill="white"/><circle cx="12" cy="19" r="1.5" fill="white"/><circle cx="5" cy="12" r="1.5" fill="white"/><circle cx="19" cy="12" r="1.5" fill="white"/>';
    } else if (point.type === 'activity') {
      color = colors.primaryGreen;
      // Icône activité / cible
      svgContent = '<circle cx="12" cy="12" r="10" fill="none" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="white" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="white"/>';
    } else if (point.type === 'restaurant') {
      color = colors.warning; // Orange pour la restauration
      // Icône fourchette/couteau (restaurant)
      svgContent = '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="white"/>';
    } else if (point.type === 'poi') {
      if (point.poi_type === 'toilets') {
        color = colors.white;
        // Icône WC
        svgContent = '<path d="M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z" fill="' + (colors.secondaryDark) + '"/>';
      } else if (point.poi_type === 'shop') {
        color = '#29B6F6'; // Bleu clair pour les boutiques
        // Icône boutique
        svgContent = '<path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4V8h16v11z" fill="white"/>';
      } else {
        color = colors.secondaryGrey;
        // Icône par défaut (point d'intérêt)
        svgContent = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>';
      }
    }

    const html = `
      <div style="
        width: 36px;
        height: 36px;
        background-color: ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.6);
      ">
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          ${svgContent}
        </svg>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 600,
          bgcolor: colors.secondaryDarkAlt,
          borderRadius: 2,
        }}
      >
        <CircularProgress sx={{ color: colors.primaryGreen }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data || mapPoints.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Aucun point à afficher sur la carte.
      </Alert>
    );
  }

  // Bornes de la carte basées sur l'image (élargies pour remplir le viewport)
  const imageBounds: L.LatLngBoundsExpression = [
    [48.843, 2.315],  // Sud-Ouest (agrandi en hauteur et largeur)
    [48.872, 2.390],  // Nord-Est (agrandi en hauteur et largeur)
  ];

  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '1024 / 535',
        maxHeight: { xs: 400, md: 550, lg: 600 },
        borderRadius: 2,
        overflow: 'hidden',
        border: `2px solid ${colors.secondaryGrey}`,
        position: 'relative',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          bgcolor: colors.secondaryDark,
        },
      }}
    >
      <MapContainer
        center={[48.8575, 2.3525]}
        zoom={14}
        minZoom={14}
        maxZoom={18}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Image de fond du parc */}
        <ImageOverlay
          url="/map-images/carte-parc.webp"
          bounds={imageBounds}
          opacity={0.9}
        />

        {/* Marqueurs */}
        {mapPoints.map((point) => (
          <Marker
            key={`${point.type}-${point.id}`}
            position={[point.latitude, point.longitude]}
            icon={createCustomIcon(point)}
          >
            <Popup>
              <Box sx={{ p: 1, minWidth: 200, maxWidth: 300 }}>
                <Box sx={{ fontWeight: 'bold', fontSize: 16, mb: 1 }}>
                  {point.name}
                </Box>
                {point.category && (
                  <Box sx={{ fontSize: 12, color: colors.primaryGreen, mb: 1 }}>
                    {point.category.name}
                  </Box>
                )}
                {point.description && (
                  <Box sx={{ fontSize: 14, mb: 1 }}>
                    {point.description.slice(0, 100)}
                    {point.description.length > 100 && '...'}
                  </Box>
                )}
                {point.thrill_level && (
                  <Box sx={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Frisson:</Box> {point.thrill_level}/5
                  </Box>
                )}
                {point.duration && (
                  <Box sx={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Durée:</Box> {point.duration} min
                  </Box>
                )}
                {point.wait_time && point.type !== 'poi' && (
                  <Box sx={{ mt: 1 }}>
                    <WaitTime minutes={point.wait_time} variant="inline" />
                  </Box>
                )}
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
