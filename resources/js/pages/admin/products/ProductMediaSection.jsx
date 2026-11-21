import React from 'react';
import { Image as ImageIcon, UploadCloud } from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return `/storage/${src.replace(/^\/?(storage\/)?/, '')}`;
}

export default function ProductMediaSection({ form, imageFile, setImageFile, extraFiles, setExtraFiles, label }) {
    const primaryPreview = imageFile ? URL.createObjectURL(imageFile) : resolveImg(form.images?.[0]);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ImageIcon size={18} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">3. Product Imagery &amp; Angle Gallery</h3>
                    <p className="text-[11px] text-slate-500">Primary cover image displayed on product cards, plus up to 2 extra angles for item view.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Primary Image Card */}
                <div className="bg-slate-50/70 p-4 rounded-xl border-2 border-dashed border-indigo-200 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Primary Photo *</span>
                            {primaryPreview && (
                                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                                    {imageFile ? 'New Selected' : 'Saved Photo'}
                                </span>
                            )}
                        </div>
                        <div className="w-full aspect-[4/3] rounded-lg bg-white border border-slate-200 overflow-hidden mb-3 flex items-center justify-center">
                            {primaryPreview ? (
                                <img src={primaryPreview} alt="Primary" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <UploadCloud size={28} className="mx-auto text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-400">No primary photo</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept={ACCEPT_IMAGE_ATTR}
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (f && validateImageFile(f).valid) setImageFile(f);
                                else e.target.value = '';
                            }}
                            className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Extra Images 1, 2 */}
                {[0, 1].map(idx => {
                    const extraFile = extraFiles[idx];
                    const existingImg = form.images?.[idx + 1];
                    const preview = extraFile ? URL.createObjectURL(extraFile) : resolveImg(existingImg);

                    return (
                        <div key={idx} className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Angle {idx + 1}</span>
                                    {preview && (
                                        <span className="text-[10px] bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                                            {extraFile ? 'New' : 'Saved'}
                                        </span>
                                    )}
                                </div>
                                <div className="w-full aspect-[4/3] rounded-lg bg-white border border-slate-200 overflow-hidden mb-3 flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-3">
                                            <ImageIcon size={24} className="mx-auto text-slate-300 mb-1" />
                                            <span className="text-[11px] text-slate-400">Optional angle</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept={ACCEPT_IMAGE_ATTR}
                                    onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f && validateImageFile(f).valid) {
                                            const next = [...extraFiles];
                                            next[idx] = f;
                                            setExtraFiles(next);
                                        } else {
                                            e.target.value = '';
                                        }
                                    }}
                                    className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
