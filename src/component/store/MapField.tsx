"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { setMarkers, setInfoWindows } from "@/redux/features/storeSlice";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

const MapField = () => {
  const storeList = useAppSelector((state) => state.store.storeData);
  const mapCoords = useAppSelector((state) => state.store.mapCoords);
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const createMap = (lat: string, lng: string) => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(lat, lng),
      logoControl: false,
      tileDuration: 200,
      zoom: 15,
    });

    const newMarkers = {};
    const newInfoWindows = {};

    // 마커 표시
    storeList?.forEach((place) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.y, place.x),
        map: map,
        title: place.place_name,
        icon: {
          url: "/media/icon/pin.png",
          size: new window.naver.maps.Size(50, 50),
          origin: new window.naver.maps.Point(0, 0),
          anchor: new window.naver.maps.Point(50, 50),
        },
      });

      // 정보창 객체 생성
      const infoWindow = new window.naver.maps.InfoWindow({
        content: [
          '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
          `   <div style="font-weight: bold; margin-bottom: 5px;">${place.place_name}</div>`,
          `   <div style="font-size: 13px;">${
            place.place_url || "No description available"
          }</div>`,
          "</div>",
        ].join(""),
        maxWidth: 300,
        anchorSize: {
          width: 12,
          height: 14,
        },
        borderColor: "#cecdc7",
      });

      newMarkers[place.id] = marker;
      newInfoWindows[place.id] = infoWindow;

      // 마커 클릭 이벤트 핸들러 추가
      window.naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
          map.panTo(marker.position);
        }
      });
    });
    dispatch(setMarkers(newMarkers));
    dispatch(setInfoWindows(newInfoWindows));
  };

  useEffect(() => {
    if (mapCoords) {
      createMap(mapCoords.y, mapCoords.x);
    }
  }, [mapCoords, storeList]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "620px" }}></div>
    </div>
  );
};

export default MapField;
