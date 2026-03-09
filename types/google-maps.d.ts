declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map
        Marker: new (options?: google.maps.MarkerOptions) => google.maps.Marker
        InfoWindow: new (options?: google.maps.InfoWindowOptions) => google.maps.InfoWindow
        Size: new (width: number, height: number) => google.maps.Size
        LatLng: new (lat: number, lng: number) => google.maps.LatLng
        MapOptions: {
          center?: google.maps.LatLng | { lat: number; lng: number }
          zoom?: number
          styles?: google.maps.MapTypeStyle[]
        }
        MarkerOptions: {
          position?: google.maps.LatLng | { lat: number; lng: number }
          map?: google.maps.Map
          title?: string
          icon?: string | google.maps.Icon
        }
        InfoWindowOptions: {
          content?: string | Node
        }
        Icon: {
          url: string
          scaledSize?: google.maps.Size
        }
        MapTypeStyle: {
          featureType?: string
          elementType?: string
          stylers: Array<{ [key: string]: any }>
        }
        Map: {
          setCenter: (latlng: google.maps.LatLng | { lat: number; lng: number }) => void
          setZoom: (zoom: number) => void
        }
        Marker: {
          setMap: (map: google.maps.Map | null) => void
          addListener: (eventName: string, handler: Function) => void
        }
        InfoWindow: {
          open: (map: google.maps.Map, anchor?: google.maps.Marker) => void
          close: () => void
        }
        Size: {
          width: number
          height: number
        }
        LatLng: {
          lat: () => number
          lng: () => number
        }
      }
    }
  }
}

export {}
