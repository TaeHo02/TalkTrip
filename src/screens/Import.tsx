import * as React from "react";
import { useState } from "react";
import { Colors } from "../theme/colors";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, ScrollView } from "react-native";
import TopBar from "../components/TopBar";
import BottomTabBar from "../components/BottomTabBar";
import { Icons } from "../assets";

// 🚨 이름이 바뀐 '진짜' 최신 라이브러리로 임포트!
import { pick, types } from '@react-native-documents/picker';
import axios from 'axios';

const Import = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
    const [displayedText, setDisplayedText] = useState('가져온 .txt 파일 내용이 여기에 표시됩니다.');

    const handleFileUpload = async () => {
        try {
            // 1. 휴대폰 내 파일 선택창 열기 (txt 파일만)
            const [res] = await pick({
                type: [types.plainText],
            });

            setDisplayedText('서버에서 데이터를 분석 중입니다... ⏳');

            // 2. Django 백엔드 전송용 FormData 생성
            const formData = new FormData();
            formData.append('file', {
                uri: res.uri,
                type: res.type || 'text/plain',
                name: res.name,
            } as any);

            // 3. Django 서버로 POST 요청 (포트 번호 8000)
            const response = await axios.post('http://10.0.2.2:8000/api/receive-kakao-text/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 4. 서버에서 받은 전처리 결과 반영
            const messages = response.data.parsed_messages;

            if (messages && messages.length > 0) {
                const formattedText = messages
                    .map((msg: any) => `[${msg.timestamp}] ${msg.message}`)
                    .join('\n');
                setDisplayedText(formattedText);
            } else {
                setDisplayedText('분석된 대화 내용이 없습니다.');
            }

        } catch (err: any) {
            // 사용자가 파일 선택을 취소하고 뒤로가기 한 경우는 조용히 넘어감
            if (err && err.message && err.message.toLowerCase().includes('cancel')) {
                return;
            }
            console.error('파일 처리 오류:', err);
            Alert.alert('오류', '서버와 통신하는 중 문제가 발생했습니다.');
            setDisplayedText('가져온 .txt 파일 내용');
        }
    };

    return (
        <View style={styles.import}>
            <TopBar title="가져오기" transparent />
            <View style={styles.content}>
                <TouchableOpacity 
                    style={[styles.button, styles.iconFlexBox]} 
                    onPress={handleFileUpload}
                >
                    <View style={[styles.icon, styles.iconFlexBox]}>
                        <Image style={styles.icon2} resizeMode="cover" source={Icons.ImportOn} />
                    </View>
                    <Text style={[styles.txt, styles.txtTypo]}>.txt 파일 가져오기</Text>
                </TouchableOpacity>

                <View style={[styles.frame, styles.frameFlexBox]}>
                    <Text style={[styles.txt2, styles.txtTypo]}>.txt 파일을 가져와서 일정을 만들 수 있습니다.</Text>
                </View>

                <View style={styles.frame2}>
                    <ScrollView style={styles.txt3FlexBox} showsVerticalScrollIndicator={true}>
                        <Text style={styles.txt3}>{displayedText}</Text>
                    </ScrollView>
                    <Text style={styles.txt4}>가져온 .txt 파일 내용</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.button2, styles.iconFlexBox]}
                    onPress={() => onNavigate('Schedule')}
                >
                    <Text style={[styles.text, styles.txtTypo]}>여행 동선 분석하기</Text>
                </TouchableOpacity>
            </View>
            <BottomTabBar activeTab="Import" onNavigate={onNavigate} />
        </View>
    );
};

const styles = StyleSheet.create({
    iconFlexBox: { justifyContent: "center", overflow: "hidden", alignItems: "center" },
    txtTypo: { textAlign: "center", fontFamily: "Roboto-Bold", fontWeight: "700" },
    frameFlexBox: { flexDirection: "row", alignSelf: "stretch" },
    txt3FlexBox: { flex: 1, alignSelf: "stretch" },
    import: { width: "100%", alignItems: "center", backgroundColor: Colors.background.secondary, flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 102, zIndex: 0, gap: 10, overflow: "hidden", alignSelf: "stretch", alignItems: "stretch", flex: 1 },
    button: { height: 42, borderStyle: "dashed", borderColor: Colors.primary, flexDirection: "row", alignSelf: "stretch", borderWidth: 1, backgroundColor: Colors.background.white, justifyContent: "center", borderRadius: 12, gap: 10 },
    icon: { width: 20 },
    icon2: { height: 20, width: 20 },
    txt: { color: Colors.primary, letterSpacing: -0.4, fontSize: 14, textAlign: "center", fontFamily: "Roboto-Bold", fontWeight: "700" },
    frame: { overflow: "hidden", alignItems: "flex-start", paddingLeft: 12 },
    txt2: { letterSpacing: -0.2, color: Colors.text.secondary, fontSize: 12, textAlign: "left" },
    frame2: { flex: 1, padding: 12, borderColor: Colors.border.default, borderStyle: "solid", borderWidth: 1, backgroundColor: Colors.background.white, borderRadius: 12, overflow: "hidden", alignSelf: "stretch" },
    txt3: { fontFamily: "Roboto-Regular", textAlign: "left", fontSize: 12, color: Colors.text.primary, letterSpacing: -0.4, lineHeight: 18 },
    txt4: { fontSize: 12, color: Colors.text.secondary, textAlign: "left", fontFamily: "Roboto-Regular", letterSpacing: -0.4, marginTop: 10 },
    button2: { height: 50, backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 2, flexDirection: "row", alignSelf: "stretch", borderRadius: 12, justifyContent: "center" },
    text: { color: Colors.background.white, letterSpacing: -0.4, fontSize: 14, textAlign: "center", fontFamily: "Roboto-Bold", fontWeight: "700" }
});

export default Import;