import * as React from "react";
import { useState, useEffect } from "react"; // 서버 데이터 관리를 위해 추가
import axios from "axios"; // 서버 통신을 위해 추가
import { Colors } from "../theme/colors";
import { Image, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import TopBar from "../components/TopBar";
import BottomTabBar from "../components/BottomTabBar";
import { Icons, Images } from "../assets";

const Schedule = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
    // 1. 서버에서 가져온 여행 목록을 저장할 상태값
    const [trips, setTrips] = useState<any[]>([]);

    // 2. 화면이 켜질 때 Django 서버에서 데이터를 가져오는 로직
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get("http://10.0.2.2:8000/api/test/");
                
                
                console.log("연결 성공! 데이터:", response.data); 
                
                setTrips([]);
            } catch (error) {
                console.error("서버 연결 실패:", error);
            }
        };
        fetchTrips();
    }, []);

    return (
        <View style={styles.schedule}>
            <TopBar title="일정" hasBorder>
                <View style={styles.tabContainer}>
                    <View style={[styles.tabButton, styles.activeTab]}>
                        <Text style={[styles.tabText, styles.activeTabText]}>전체</Text>
                    </View>
                    <View style={styles.tabButton}>
                        <Text style={styles.tabText}>진행 중</Text>
                    </View>
                    <View style={styles.tabButton}>
                        <Text style={styles.tabText}>예정된 여행</Text>
                    </View>
                    <View style={styles.tabButton}>
                        <Text style={styles.tabText}>지난 여행</Text>
                    </View>
                </View>
            </TopBar>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* 3. 서버에서 받은 데이터(trips) 개수만큼 자동으로 카드 생성 */}
                    {trips.map((trip, index) => (
                        <View key={trip.id || index} style={styles.button}>
                            <View style={styles.frame}>
                                {/* 이미지는 서버에서 보내준 url을 쓰거나 기본 이미지를 사용함 */}
                                <Image 
                                    style={[styles.imageIcon, styles.frame2Position]} 
                                    resizeMode="cover" 
                                    source={trip.image_url ? { uri: trip.image_url } : Images.Thumb1} 
                                />
                                <View style={[styles.frame2, styles.frame2Position]}>
                                    <View style={[styles.frame3, styles.frame3FlexBox]}>
                                        <Text style={[styles.text, styles.textTypo5]}>
                                            {trip.status || "여행 중"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.frame4}>
                                <View style={[styles.frame5, styles.frame5FlexBox]}>
                                    <View style={styles.frame6}>
                                        <Text style={[styles.text2, styles.textTypo5]}>{trip.title}</Text>
                                        <Text style={[styles.text3, styles.textClr]}>
                                            {trip.start_date} - {trip.end_date} ({trip.duration})
                                        </Text>
                                    </View>
                                    <View style={styles.button2}>
                                        <View style={[styles.icon, styles.iconLayout]}>
                                            <Image style={styles.iconLayout} resizeMode="cover" source={Icons.Kebab} />
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.frame7, styles.frameFlexBox]}>
                                    <TouchableOpacity style={styles.button3} onPress={() => onNavigate('ScheduleDetail')}>
                                        <Text style={[styles.text4, styles.textTypo4]}>일정 보기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <BottomTabBar activeTab="Schedule" onNavigate={onNavigate} />
        </View>
    );
};

// --- 아래 스타일 코드는 기존과 동일합니다 ---
const styles = StyleSheet.create({
    frame2Position: { left: 0, top: 0 },
    frame3FlexBox: { backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" },
    textTypo5: { textAlign: "left", fontFamily: "Roboto-Bold", fontWeight: "700" },
    frame5FlexBox: { gap: 0, justifyContent: "space-between", flexDirection: "row" },
    textClr: { color: Colors.text.secondary, fontSize: 14 },
    iconLayout: { height: 16, width: 16 },
    frameFlexBox: { flexDirection: "row", overflow: "hidden", alignSelf: "stretch", alignItems: "center" },
    textTypo4: { fontFamily: "Roboto-Medium", fontWeight: "500", textAlign: "left" },
    textTypo3: { textAlign: "center", fontFamily: "Roboto-Bold", fontWeight: "700" },
    frameLayout: { height: 24, width: 64, borderRadius: 12, overflow: "hidden" },
    schedule: { width: "100%", alignItems: "center", flex: 1, backgroundColor: Colors.background.primary },
    scrollView: { width: "100%", flex: 1 },
    scrollContent: { paddingBottom: 100, flexGrow: 1 },
    content: { paddingHorizontal: 16, paddingVertical: 12, gap: 16, overflow: "hidden", alignSelf: "stretch" },
    button: { borderWidth: 1, borderColor: Colors.border.default, borderRadius: 12, borderStyle: "solid", overflow: "hidden", alignSelf: "stretch", backgroundColor: Colors.background.primary },
    frame: { height: 140, overflow: "hidden", alignSelf: "stretch" },
    imageIcon: { right: 0, maxWidth: "100%", maxHeight: "100%", bottom: 0, position: "absolute", top: 0, overflow: "hidden" },
    frame2: { width: 326, padding: 12, position: "absolute", top: 0, overflow: "hidden", height: 140 },
    frame3: { justifyContent: "center", height: 24, width: 64, borderRadius: 12, overflow: "hidden" },
    text: { fontSize: 12, color: Colors.background.white },
    frame4: { padding: 16, gap: 6, backgroundColor: Colors.background.white, alignSelf: "stretch", alignItems: "center" },
    frame5: { alignSelf: "stretch" },
    frame6: { flex: 1 },
    text2: { fontSize: 18, lineHeight: 23, color: Colors.text.primaryDark, alignSelf: "stretch" },
    text3: { fontFamily: "Roboto-Medium", fontWeight: "500", textAlign: "left", alignSelf: "stretch" },
    button2: { overflow: "hidden", alignItems: "center" },
    icon: { justifyContent: "center", overflow: "hidden", alignItems: "center" },
    frame7: { justifyContent: "flex-end" },
    button3: { height: 32, width: 90, borderRadius: 6, backgroundColor: Colors.surface.lightBlue, justifyContent: "center", overflow: "hidden", alignItems: "center" },
    text4: { color: Colors.primary, fontSize: 14 },
    tabContainer: { height: 35, flexDirection: "row", alignSelf: "stretch" },
    tabButton: { height: 35, paddingBottom: 6, justifyContent: "center", alignItems: "center", flex: 1 },
    activeTab: { borderColor: Colors.primary, borderBottomWidth: 2, borderStyle: "solid" },
    tabText: { fontSize: 14, letterSpacing: -0.4, textAlign: "center", fontFamily: "Roboto-Bold", fontWeight: "700", color: Colors.text.secondary },
    activeTabText: { color: Colors.primary }
});

export default Schedule;