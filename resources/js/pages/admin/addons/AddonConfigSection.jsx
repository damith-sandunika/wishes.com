import React from 'react';
import { Plus, Trash2, Layers, CheckSquare, Image as ImageIcon } from 'lucide-react';
import { validateImageFile, ACCEPT_IMAGE_ATTR } from '../../../utils/imageValidation';

export default function AddonConfigSection({ options = [], setOptions, optionFiles = {}, setOptionFiles, fields = [], setFields, inp }) {
    const addOption = () => {
        setOptions([...options, { name: '', price: '', image: '' }]);
    };
    const updateOption = (idx, key, val) => {
        const next = [...options];
        next[idx] = { ...next[idx], [key]: val };
        setOptions(next);
    };
    const removeOption = (idx) => {
        setOptions(options.filter((_, i) => i !== idx));
        if (setOptionFiles) {
            const nextFiles = { ...optionFiles };
            delete nextFiles[idx];
            setOptionFiles(nextFiles);
        }
    };

    const addField = () => {
        setFields([...fields, { label: '', type: 'text', required: true, placeholder: '' }]);
    };
    const updateField = (idx, key, val) => {
        const next = [...fields];
        next[idx] = { ...next[idx], [key]: val };
        setFields(next);
    };
    const removeField = (idx) => {
        setFields(fields.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-6">
            {/* Sub-Options / Styles Builder */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <Layers size={17} className="text-blue-600" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 block">Sub-Styles &amp; Variations (With Individual Photos &amp; Prices)</span>
                            <span className="text-[10px] text-slate-400">e.g. Wrapping Paper patterns, Gift Card designs, Box sizes.</span>
                        </div>
                    </div>
                    <button type="button" onClick={addOption} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition">
                        <Plus size={14} /> Add Style / Option
                    </button>
                </div>

                {options.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-1">No sub-styles added. Click "Add Style / Option" to configure variations.</p>
                ) : (
                    <div className="space-y-2.5">
                        {options.map((opt, i) => {
                            const optFile = optionFiles[i];
                            const optPreview = optFile ? URL.createObjectURL(optFile) : (opt.image || '');

                            return (
                                <div key={i} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                                    {/* Style Image Upload & Preview */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                            {optPreview ? (
                                                <img src={optPreview} alt={opt.name || 'Style'} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                        <label className="cursor-pointer px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 transition">
                                            {optPreview ? 'Change Photo' : 'Upload Photo'}
                                            <input
                                                type="file"
                                                accept={ACCEPT_IMAGE_ATTR}
                                                className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f && validateImageFile(f).valid && setOptionFiles) {
                                                        setOptionFiles({ ...optionFiles, [i]: f });
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* Style Name */}
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={opt.name}
                                            onChange={e => updateOption(i, 'name', e.target.value)}
                                            placeholder="Style Name (e.g. Matte Gold Foil Wrap)"
                                            className={inp}
                                        />
                                    </div>

                                    {/* Style Price */}
                                    <div className="w-full sm:w-32">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={opt.price}
                                            onChange={e => updateOption(i, 'price', e.target.value)}
                                            placeholder="Price (LKR)"
                                            className={inp}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeOption(i)}
                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg self-end sm:self-center"
                                        title="Remove style"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Customer Input Fields to Collect */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <CheckSquare size={17} className="text-purple-600" />
                        <div>
                            <span className="text-xs font-bold text-slate-800 block">Customer Details to Collect (Optional)</span>
                            <span className="text-[10px] text-slate-400">e.g. Recipient's Name, Age, Custom Greeting Wish, Photo upload.</span>
                        </div>
                    </div>
                    <button type="button" onClick={addField} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition">
                        <Plus size={14} /> Add Field
                    </button>
                </div>

                {fields.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-1">No custom customer fields required for this item.</p>
                ) : (
                    <div className="space-y-2.5">
                        {fields.map((f, i) => (
                            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs items-center">
                                <div className="sm:col-span-4">
                                    <input type="text" value={f.label} onChange={e => updateField(i, 'label', e.target.value)}
                                        placeholder="Field Label (e.g. Name, Age)" className={inp} />
                                </div>
                                <div className="sm:col-span-3">
                                    <select value={f.type} onChange={e => updateField(i, 'type', e.target.value)} className={inp}>
                                        <option value="text">Text (Short)</option>
                                        <option value="number">Number (e.g. Age)</option>
                                        <option value="textarea">Textarea (Long Note)</option>
                                        <option value="file">Photo Upload</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-3">
                                    <input type="text" value={f.placeholder || ''} onChange={e => updateField(i, 'placeholder', e.target.value)}
                                        placeholder="Placeholder hint..." className={inp} />
                                </div>
                                <div className="sm:col-span-2 flex items-center justify-between gap-1">
                                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={Boolean(f.required)} onChange={e => updateField(i, 'required', e.target.checked)} className="rounded text-purple-600" />
                                        <span className="font-bold text-[11px]">Required</span>
                                    </label>
                                    <button type="button" onClick={() => removeField(i)} className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
