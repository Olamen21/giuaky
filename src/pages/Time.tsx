import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const Time: React.FC = () => {

    const [currentTime, setCurrentTime] =  useState<string>("");
    const [photo, setPhoto] = useState<string | null>(null);

    const handleShowTime = async () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const formattedTime = `Bây giờ là ${hours} giờ ${minutes} phút ${seconds} giây`;

        setCurrentTime(formattedTime);

        await LocalNotifications.schedule({
            notifications: [
                {
                    id: 1,
                    title: "Hiển thị thời gian hiện tại",
                    body: `Bây giờ là ${hours} giờ ${minutes} phút ${seconds} giây.`,
                    schedule: { at: new Date(Date.now() + 1000) }, // Hiển thị sau 1 giây
                },
            ],
        });
    };

    const handleShareTime = async () => {
        if (!currentTime) return;

        await Share.share({
            title: "Chia sẻ thời gian",
            text: currentTime,
            dialogTitle: "Chia sẻ thời gian hiện tại",
        });
    };

    const takePhoto = async () => {
        try {
            const image = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                quality: 90,
            });
            setPhoto(image.webPath || null);
        } catch (error) {
            console.error("Lỗi khi chụp ảnh:", error);
        }
    };



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={"success"}>
                    <IonTitle>Hiển thị thời gian</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardContent className="ion-padding">
                        {currentTime && (
                            <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
                                {currentTime}
                            </p>
                        )}
                        
                        <IonButton onClick={handleShowTime} color="danger" expand="full" className="ion-margin-top">Thời gian hiện tại</IonButton>
                        <IonButton onClick={handleShareTime} color="primary" expand="full" className="ion-margin-top">
                            Chia sẻ thời gian
                        </IonButton>
                        <IonButton color="tertiary" expand="full" className="ion-margin-top" onClick={takePhoto}>
                            Chụp ảnh
                        </IonButton>

                        {/* Hiển thị ảnh đã chụp */}
                        {photo && (
                            <IonImg src={photo} className="ion-margin-top" />
                        )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Time;