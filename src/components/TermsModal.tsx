import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { theme, fonts } from '../lib/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  mode?: 'accept' | 'view';
};

const SECTIONS: { title: string; body: string }[] = [
  { title: 'شروط الاستخدام وسياسات التطبيق', body: '' },
  { title: '1) طبيعة التطبيق', body: 'التطبيق منصة وسيطة لعرض مقدمي خدمات الخياطة بناءً على تقييمات المستخدمين، ولا يقدم خدمات الخياطة مباشرة، ولا يتحمل مسؤولية جودة الخدمة أو أي اتفاق بين العميل والخياط.' },
  { title: '2) العلاقة التعاقدية', body: 'يقر المستخدم أن العلاقة تتم بينه وبين الخياط فقط، وأن التطبيق ليس طرفًا في أي اتفاق أو نزاع، ويقتصر دوره على العرض والتواصل والحجز والتقييمات.' },
  { title: '3) استخدام التطبيق', body: 'يلتزم المستخدم بالاستخدام القانوني، ويُمنع تقديم معلومات غير صحيحة أو إساءة الاستخدام أو التحايل على الدفع (إن وجد).' },
  { title: '4) التقييمات والمحتوى', body: 'التقييمات تعكس تجارب المستخدمين، ولا يضمن التطبيق دقتها، ويحق له حذف أي محتوى غير لائق.' },
  { title: '5) إخلاء المسؤولية', body: 'لا يتحمل التطبيق مسؤولية جودة الخياطة، دقة المقاسات، التأخير، أو أي خسائر ناتجة عن الخدمة، وتقع المسؤولية على الخياط.' },
  { title: '6) الأعطال التقنية', body: 'لا يضمن التطبيق العمل دون انقطاع أو أخطاء، ولا يتحمل مسؤولية أي خلل تقني أو فقدان بيانات مؤقت.' },
  { title: '7) التعديلات', body: 'يحق للتطبيق تعديل الشروط في أي وقت، ويُعد استمرار الاستخدام موافقة على التحديثات.' },
  { title: '8) إيقاف الحساب', body: 'يحق للتطبيق إيقاف أو حذف الحساب في حال إساءة الاستخدام.' },
  { title: '9) القانون', body: 'تخضع هذه الشروط لقوانين دولة الكويت.' },
  { title: 'سياسة الاسترجاع (Refund Policy)', body: 'جميع الطلبات تتم بين العميل والخياط مباشرة.\nسياسة الإرجاع يحددها الخياط، وأي طلب يتم بين الطرفين.\nلا يضمن التطبيق الاسترجاع أو التعديلات، ودوره يقتصر على تسهيل التواصل.\nلا يتحمل التطبيق مسؤولية النزاعات المالية.' },
  { title: 'سياسة القياسات (Measurement Policy)', body: 'مسؤولية القياسات تقع على الخياط أو العميل.\nيجب إدخال بيانات دقيقة، وأي خطأ يتحمله مقدم القياس.\nفي الخدمة المنزلية، الخياط/المندوب مسؤول عن الدقة.\nلا يضمن التطبيق ملاءمة المنتج النهائي أو تطابق المقاسات.' },
];

export function TermsModal({ visible, onClose, onAccept, mode = 'accept' }: Props) {
  const [agreed, setAgreed] = useState(false);
  const isView = mode === 'view';

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.bg }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-5 py-3"
          style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
        >
          <Pressable onPress={onClose} hitSlop={10}>
            <Ionicons name="close" size={26} color={theme.colors.text} />
          </Pressable>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: theme.colors.text }}>
            الشروط والأحكام
          </Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Body */}
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {SECTIONS.map((s, idx) => (
            <View key={idx} style={{ marginBottom: idx === 0 ? 18 : 14 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: idx === 0 ? 20 : 15,
                  color: theme.colors.text,
                  textAlign: 'right',
                  marginBottom: s.body ? 6 : 0,
                  writingDirection: 'rtl',
                }}
              >
                {s.title}
              </Text>
              {s.body ? (
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 13.5,
                    lineHeight: 22,
                    color: theme.colors.textMuted,
                    textAlign: 'right',
                    writingDirection: 'rtl',
                  }}
                >
                  {s.body}
                </Text>
              ) : null}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        {isView ? (
          <View
            className="px-5 pt-4 pb-2"
            style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }}
          >
            <Pressable
              onPress={onClose}
              className="h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 15 }}>
                إغلاق
              </Text>
            </Pressable>
          </View>
        ) : (
          <View
            className="px-5 pt-4 pb-2"
            style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }}
          >
            <Pressable onPress={() => setAgreed((v) => !v)} className="flex-row items-center mb-3">
              <View
                className="w-6 h-6 rounded-md items-center justify-center"
                style={{
                  borderWidth: 2,
                  borderColor: agreed ? theme.colors.primary : theme.colors.border,
                  backgroundColor: agreed ? theme.colors.primary : 'transparent',
                }}
              >
                {agreed && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 13,
                  color: theme.colors.text,
                  marginLeft: 10,
                  flex: 1,
                  textAlign: 'right',
                  writingDirection: 'rtl',
                }}
              >
                لقد قرأت ووافقت على شروط الاستخدام والسياسات أعلاه
              </Text>
            </Pressable>

            <Pressable
              onPress={() => { if (agreed && onAccept) onAccept(); }}
              disabled={!agreed}
              className="h-14 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: agreed ? theme.colors.primary : theme.colors.border,
                opacity: agreed ? 1 : 0.7,
              }}
            >
              <Text style={{ fontFamily: fonts.bold, color: 'white', fontSize: 15 }}>
                موافق ومتابعة
              </Text>
            </Pressable>

            <Pressable onPress={onClose} className="h-12 items-center justify-center mt-1">
              <Text style={{ fontFamily: fonts.semibold, color: theme.colors.textMuted, fontSize: 13 }}>
                رفض
              </Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
