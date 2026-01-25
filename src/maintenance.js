// Maintenance Remote Configuration
// استبدل هذا الرابط برابط الـ Raw Gist الخاص بك
const REMOTE_CONFIG_URL = "https://gist.githubusercontent.com/WD-FAWZI/6abe420aaae21a836fba9f92a90ffa30/raw/b99cdd01b01afe8840d40baf69b8fbee1b3fc10f/maintenance.json";

/**
 * Fetches the maintenance status from a remote URL.
 * @returns {Promise<{active: boolean, message: string}>}
 */
export const getRemoteMaintenanceStatus = async () => {
    try {
        // نستخدم cache: 'no-store' لضمان عدم تخزين الحالة القديمة في المتصفح
        const response = await fetch(REMOTE_CONFIG_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch config');
        return await response.json();
    } catch (error) {
        console.error("Error fetching maintenance status:", error);
        // في حال فشل الاتصال بالرابط، نفترض أن الموقع يعمل (أو يمكنك عكس ذلك للأمان)
        return { active: false, message: "" };
    }
};

// الدوال القديمة سنبقيها متوافقة مع التعديل الجديد
export const isUnderMaintenance = async () => {
    const status = await getRemoteMaintenanceStatus();
    return status.active;
};

export const getMaintenanceMessage = async () => {
    const status = await getRemoteMaintenanceStatus();
    return status.message;
};
