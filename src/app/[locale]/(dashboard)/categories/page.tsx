"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Category } from "@/types";

const mockCategories: Category[] = [
  { id: "1", name: "Hambúrgueres", description: "Todos os tipos de hambúrgueres", productCount: 8, companyId: "1" },
  { id: "2", name: "Pizzas", description: "Pizzas artesanais e tradicionais", productCount: 6, companyId: "1" },
  { id: "3", name: "Bebidas", description: "Refrigerantes, sucos e cafés", productCount: 12, companyId: "1" },
  { id: "4", name: "Sobremesas", description: "Doces e sobremesas especiais", productCount: 5, companyId: "1" },
  { id: "5", name: "Combos", description: "Combinações com desconto", productCount: 4, companyId: "1" },
  { id: "6", name: "Entradas", description: "Aperitivos e entradas", productCount: 3, companyId: "1" },
];

const categoryIcons: Record<string, string> = {
  "1": "🍔", "2": "🍕", "3": "🥤", "4": "🍰", "5": "🍱", "6": "🥗",
};

export default function CategoriesPage() {
  const t = useTranslations("categories");
  const tc = useTranslations("common");
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({ name: category.name, description: category.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: form.name, description: form.description }
          : c
      ));
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        productCount: 0,
        companyId: "1",
      };
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{categories.length} {t("title").toLowerCase()}</p>
        </div>
        <Button onClick={openAddModal}>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("addCategory")}
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">{t("noCategories")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl">
                    {categoryIcons[category.id] || "📁"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(category)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t("productCount")}</span>
                  <span className="text-sm font-semibold text-gray-900">{category.productCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? t("editCategory") : t("addCategory")}
      >
        <div className="space-y-4">
          <Input
            id="categoryName"
            label={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Hambúrgueres"
          />
          <Input
            id="categoryDesc"
            label={t("description")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descrição da categoria"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleSave}>
              {tc("save")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
