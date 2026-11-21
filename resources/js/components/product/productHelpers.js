export const formatProduct = (p) => {
    const imgs = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
    const formattedImgs = imgs.map(img => {
        if (!img) return '/images/placeholder.png';
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `/storage/${img.replace(/^\/?(storage\/)?/, '')}`;
    });
    const fallbackImg = formattedImgs[0] || '/images/placeholder.png';

    const reviews = Array.isArray(p.reviews) ? p.reviews.filter(r => r.is_approved !== false) : [];
    const reviewsCount = reviews.length;
    const rating = reviewsCount > 0 
        ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviewsCount).toFixed(1))
        : 0;

    return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: Number(p.discount_price || p.selling_price || 0),
        oldPrice: p.discount_price ? Number(p.selling_price) : null,
        image: fallbackImg,
        images: formattedImgs.length > 0 ? formattedImgs : [fallbackImg],
        discount: p.discount_price && Number(p.selling_price) > Number(p.discount_price)
            ? Math.round(((Number(p.selling_price) - Number(p.discount_price)) / Number(p.selling_price)) * 100) 
            : 0,
        isBestseller: Boolean(p.is_featured),
        categoryName: p.category?.name || 'Gifts',
        categoryId: p.category_id,
        description: p.description || p.short_description || '',
        enablePersonalization: Boolean(p.enable_personalization),
        enableWrapping: Boolean(p.enable_wrapping),
        colorVariations: (Array.isArray(p.color_variations) ? p.color_variations : []).map(c => ({
            ...c,
            image: c?.image ? (c.image.startsWith('http') ? c.image : `/storage/${c.image.replace(/^\/?(storage\/)?/, '')}`) : ''
        })),
        allowedAddons: Array.isArray(p.allowed_addons) ? p.allowed_addons : [],
        freeItems: (Array.isArray(p.free_items) ? p.free_items : []).map(fi => ({
            ...fi,
            image: fi?.image ? (fi.image.startsWith('http') ? fi.image : `/storage/${fi.image.replace(/^\/?(storage\/)?/, '')}`) : ''
        })),
        reviews: reviews,
        reviewsCount: reviewsCount,
        rating: rating,
        currentStock: p.current_stock,
    };
};
