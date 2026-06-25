"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/ToastProvider";
import { formatCurrency } from "@/lib/utils";
import { Product, Category } from "@/types";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api";

export default function ProductsPage() {
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: "",
    isPromotion: false,
    promotionPrice: "",
    isCombo: false,
  });

  const fetchProducts = async (search?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const url = `/api/products${params.toString() ? `?${params.toString()}` : ""}`;
      const data = await apiGet<{ products: Product[]; total: number } | Product[]>(url);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
      }
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiGet<Category[]>("/api/categories");
      setCategories(data.map((c) => ({ value: c.id, label: c.name })));
    } catch {
      // Non-critical, use empty categories
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ name: "", description: "", price: "", categoryId: categories[0]?.value || "", stock: "", isPromotion: false, promotionPrice: "", isCombo: false });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      categoryId: product.categoryId,
      stock: product.stock.toString(),
      isPromotion: product.isPromotion,
      promotionPrice: product.promotionPrice?.toString() || "",
      isCombo: product.isCombo,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: form.categoryId,
        stock: Number(form.stock),
        isPromotion: form.isPromotion,
        promotionPrice: form.isPromotion ? Number(form.promotionPrice) : undefined,
        isCombo: form.isCombo,
        available: Number(form.stock) > 0,
      };
      if (editingProduct) {
        await apiPut(`/api/products/${editingProduct.id}`, body);
        showToast("Produto atualizado", "success");
      } else {
        await apiPost("/api/products", body);
        showToast("Produto criado com sucesso", "success");
      }
      setShowModal(false);
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Erro ao salvar produto", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) {
      return;
    }
    try {
      await apiDelete(`/api/products/${id}`);
      showToast("Produto removido", "success");
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Erro ao remover produto", "error");
    }
  };

  const toggleAvailability = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    try {
      await apiPatch(`/api/products/${id}`, { available: !product.available });
      showToast(
        product.available ? "Produto desativado" : "Produto ativado",
        "success"
      );
      await fetchProducts();
    } catch (err: any) {
      showToast(err.message || "Erro ao atualizar produto", "error");
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <div className="space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">{products.length} {t("title").toLowerCase()}</p>
        </div>
        <Button onClick={openAddModal}>
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t("addProduct")}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={`${tc("search")}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="mt-4 text-sm text-gray-500">{t("noProducts")}</p>
          <p className="mt-1 text-xs text-gray-400">Comece adicionando seu primeiro produto</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("name")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("category")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("price")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t("stock")}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{tc("status")}</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          {product.isCombo ? "\uD83C\uDF71" : "\uD83C\uDF54"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">{product.categoryName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {product.isPromotion && product.promotionPrice ? (
                          <>
                            <span className="font-medium text-red-600">{formatCurrency(product.promotionPrice)}</span>
                            <span className="ml-1 text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
                          </>
                        ) : (
                          <span className="font-medium text-gray-900">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={product.stock === 0 ? "text-red-600 font-medium" : "text-gray-600"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.available ? "success" : "danger"}>
                        {product.available ? t("available") : t("unavailable")}
                      </Badge>
                      {product.isPromotion && (
                        <Badge variant="warning" className="ml-1">{t("promotion")}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleAvailability(product.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title={product.available ? "Desativar" : "Ativar"}
                          aria-label={product.available ? `Desativar produto ${product.name}` : `Ativar produto ${product.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.available ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-4.35-4.35" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                          aria-label={`Editar produto ${product.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remover produto ${product.name}`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? t("editProduct") : t("addProduct")}
        className="max-w-xl"
      >
        <div className="space-y-4">
          <Input
            id="productName"
            label={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Hamburguer Especial"
          />
          <Input
            id="productDesc"
            label={t("description")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descricao do produto"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="productPrice"
              label={`${t("price")} (MZN)`}
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
            />
            <Input
              id="productStock"
              label={t("stock")}
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
            />
          </div>
          <Select
            id="productCategory"
            label={t("category")}
            options={categories}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPromotion}
                onChange={(e) => setForm({ ...form, isPromotion: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{t("promotion")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isCombo}
                onChange={(e) => setForm({ ...form, isCombo: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{t("combo")}</span>
            </label>
          </div>
          {form.isPromotion && (
            <Input
              id="promotionPrice"
              label={`${t("promotion")} ${t("price")} (MZN)`}
              type="number"
              value={form.promotionPrice}
              onChange={(e) => setForm({ ...form, promotionPrice: e.target.value })}
              placeholder="Preco promocional"
            />
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : tc("save")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
