export const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPT_IMAGE_ATTR = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp';

/**
 * Validates selected file for size (<=3MB) and allowed extensions (.jpg, .jpeg, .png, .webp).
 * Shows warning message and returns false if invalid.
 *
 * @param {File} file
 * @param {boolean} showAlert Whether to trigger window.alert warning
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateImageFile(file, showAlert = true) {
    if (!file) return { valid: false, error: 'No file selected.' };

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const isAllowedExt = ALLOWED_IMAGE_EXTENSIONS.includes(ext);
    const isAllowedType = ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) || isAllowedExt;

    if (!isAllowedType) {
        const errorMsg = '⚠️ Invalid file format!\nOnly JPG, JPEG, PNG, and WEBP image files are allowed. Other formats are rejected.';
        if (showAlert) alert(errorMsg);
        return { valid: false, error: errorMsg };
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        const errorMsg = `⚠️ File size (${sizeMb}MB) exceeds the 3MB limit!\nPlease choose an image smaller than 3MB.`;
        if (showAlert) alert(errorMsg);
        return { valid: false, error: errorMsg };
    }

    return { valid: true, error: null };
}
