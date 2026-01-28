import { supabase } from './lib/supabase';

/**
 * Fetches the maintenance status from Supabase 'settings' table.
 * @returns {Promise<{active: boolean, message: string}>}
 */
export const getRemoteMaintenanceStatus = async () => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('is_maintenance, maintenance_message')
            .single();

        if (error) throw error;

        return {
            active: !!data?.is_maintenance,
            message: data?.maintenance_message || "الموقع تحت الصيانة حالياً. يرجى العودة لاحقاً."
        };
    } catch (error) {
        console.error("Error fetching maintenance status from Supabase:", error);
        // في حال فشل الاتصال، نفترض أن الموقع يعمل
        return { active: false, message: "" };
    }
};

// الدوال القديمة ستبقى متوافقة
export const isUnderMaintenance = async () => {
    const status = await getRemoteMaintenanceStatus();
    return status.active;
};

export const getMaintenanceMessage = async () => {
    const status = await getRemoteMaintenanceStatus();
    return status.message;
};
