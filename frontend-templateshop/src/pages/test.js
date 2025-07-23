import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const initialCartItems = [
	{
		id: 1,
		name: "Landing Page Mỹ Phẩm",
		price: 2500000,
		quantity: 1,
		image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120",
	},
	{
		id: 2,
		name: "Landing Page Nhà Hàng",
		price: 2200000,
		quantity: 2,
		image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120",
	},
];

function formatVND(n) {
	return n.toLocaleString("vi-VN") + "₫";
}

export default function CartPage() {
	const [cartItems, setCartItems] = useState(initialCartItems);
	const [paymentMethod, setPaymentMethod] = useState("bank");
	const [coupon, setCoupon] = useState("");
	const [discount, setDiscount] = useState(0);
	const [couponMessage, setCouponMessage] = useState("");
	const [showCoupon, setShowCoupon] = useState(false);
	const [form, setForm] = useState({
		name: "",
		address: "",
		phone: "",
		email: "",
		note: "",
	});
	const [showCheckoutForm, setShowCheckoutForm] = useState(false);

	function handleQuantityChange(id, delta) {
		setCartItems((prev) =>
			prev.map((item) =>
				item.id === id
					? { ...item, quantity: Math.max(1, item.quantity + delta) }
					: item
			)
		);
	}

	function handleRemoveItem(id) {
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	}

	const total = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const totalAfterDiscount = Math.max(0, total - discount);

	function handleApplyCoupon(e) {
		e.preventDefault();
		let appliedDiscount = 0;
		let message = "";
		if (coupon.trim().toUpperCase() === "GIAM10") {
			appliedDiscount = Math.floor(total * 0.1);
			message = "Áp dụng mã GIAM10: Giảm 10% tổng đơn hàng.";
		} else if (coupon.trim().toUpperCase() === "GIAM500K") {
			appliedDiscount = 500000;
			message = "Áp dụng mã GIAM500K: Giảm 500.000₫.";
		} else {
			message = "Mã giảm giá không hợp lệ hoặc không tồn tại.";
		}
		setDiscount(appliedDiscount);
		setCouponMessage(message);
	}

	function handleFormChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handlePayment(e) {
		e.preventDefault();
		if (!showCheckoutForm) {
			setShowCheckoutForm(true);
			return;
		}
		alert(
			`Đặt hàng thành công!\n\nThông tin:\nHọ tên: ${form.name}\nĐịa chỉ: ${
				form.address
			}\nSĐT: ${form.phone}\nEmail: ${form.email}\nGhi chú: ${
				form.note
			}\n\nTổng tiền: ${formatVND(
				totalAfterDiscount
			)}\nPhương thức: Chuyển khoản`
		);
	}

	return (
		<div className="min-h-screen bg-[#eaf3f7] py-6 sm:py-10">
			<div className="max-w-6xl mx-auto px-2 sm:px-4">
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1d3557] mb-6 sm:mb-8 text-center">
					Giỏ hàng của bạn
				</h1>
				{showCheckoutForm ? (
					<div className="max-w-lg mx-auto bg-white rounded-xl shadow p-3 sm:p-6">
						<h2 className="font-semibold text-[#1d3557] mb-4 text-lg sm:text-xl">
							Thông tin thanh toán
						</h2>
						<form className="space-y-3" onSubmit={handlePayment}>
							<input
								type="text"
								name="name"
								value={form.name}
								onChange={handleFormChange}
								placeholder="Họ và tên"
								className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded text-sm sm:text-base"
								required
							/>
							<input
								type="text"
								name="address"
								value={form.address}
								onChange={handleFormChange}
								placeholder="Địa chỉ giao hàng"
								className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded text-sm sm:text-base"
								required
							/>
							<input
								type="text"
								name="phone"
								value={form.phone}
								onChange={handleFormChange}
								placeholder="Số điện thoại"
								className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded text-sm sm:text-base"
								required
							/>
							<input
								type="email"
								name="email"
								value={form.email}
								onChange={handleFormChange}
								placeholder="Email"
								className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded text-sm sm:text-base"
								required
							/>
							<textarea
								name="note"
								value={form.note}
								onChange={handleFormChange}
								placeholder="Ghi chú cho đơn hàng (tuỳ chọn)"
								className="w-full px-3 py-2 sm:px-4 sm:py-2 border rounded text-sm sm:text-base"
								rows={2}
							/>
							<button
								type="submit"
								className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold shadow hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-base sm:text-lg mt-4"
							>
								Xác nhận đặt hàng
							</button>
						</form>
					</div>
				) : (
					<div className="flex flex-col md:flex-row gap-6 md:gap-8">
						{/* Left: Cart & Coupon */}
						<div className="flex-1 space-y-4 sm:space-y-6">
							{/* Cart Items */}
							<div className="bg-white rounded-xl shadow p-3 sm:p-6">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
									<span className="font-semibold text-[#1d3557] text-base sm:text-lg">
										Sản phẩm
									</span>
									<button
										className="text-[#38bdf8] hover:underline text-sm"
										onClick={() => setShowCoupon((v) => !v)}
									>
										{showCoupon
											? "Ẩn nhập mã giảm giá"
											: "Bạn có mã ưu đãi? Ấn vào đây để nhập mã"}
									</button>
								</div>
								{showCoupon && (
									<form
										onSubmit={handleApplyCoupon}
										className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4"
									>
										<input
											type="text"
											placeholder="Nhập mã giảm giá"
											value={coupon}
											onChange={(e) => setCoupon(e.target.value)}
											className="px-3 py-2 border rounded w-full sm:w-60 text-sm"
										/>
										<button
											type="submit"
											className="px-5 py-2 rounded bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-sm"
										>
											Áp dụng
										</button>
										{couponMessage && (
											<span className="text-xs sm:text-sm text-[#7c3aed] font-medium">
												{couponMessage}
											</span>
										)}
									</form>
								)}
								{cartItems.length === 0 ? (
									<div className="text-center text-gray-500 py-8">
										Giỏ hàng của bạn đang trống.
									</div>
								) : (
									<div className="overflow-x-auto">
										<table className="min-w-[600px] w-full text-xs sm:text-sm">
											<thead>
												<tr className="text-left text-gray-500 border-b">
													<th className="py-2">Sản phẩm</th>
													<th className="py-2">Đơn giá</th>
													<th className="py-2">Số lượng</th>
													<th className="py-2">Tổng</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												{cartItems.map((item) => (
													<tr
														key={item.id}
														className="border-b last:border-b-0"
													>
														<td className="py-3 flex items-center gap-2 sm:gap-3 min-w-[180px]">
															<img
																src={item.image}
																alt={item.name}
																className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border"
															/>
															<span className="font-medium text-[#1d3557] text-xs sm:text-sm">
																{item.name}
															</span>
														</td>
														<td className="py-3 text-[#457b9d] font-semibold">
															{formatVND(item.price)}
														</td>
														<td className="py-3">
															<div className="flex items-center gap-1 sm:gap-2">
																<button
																	className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base"
																	onClick={() =>
																		handleQuantityChange(item.id, -1)
																	}
																	disabled={item.quantity <= 1}
																	aria-label="Giảm số lượng"
																>
																	–
																</button>
																<input
																	type="number"
																	min="1"
																	value={item.quantity}
																	readOnly
																	className="w-10 sm:w-14 px-1 sm:px-2 py-1 border rounded text-center text-xs sm:text-base"
																/>
																<button
																	className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base"
																	onClick={() =>
																		handleQuantityChange(item.id, 1)
																	}
																	aria-label="Tăng số lượng"
																>
																	+
																</button>
															</div>
														</td>
														<td className="py-3 font-bold text-[#7c3aed]">
															{formatVND(item.price * item.quantity)}
														</td>
														<td className="py-3">
															<button
																className="text-red-400 hover:text-red-600 p-2 rounded-full transition"
																onClick={() => handleRemoveItem(item.id)}
															>
																<FaTrash />
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
								<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
									<a
										href="/san-pham"
										className="flex-1 px-4 py-2 rounded-lg border border-[#7c3aed] text-[#7c3aed] font-semibold text-center hover:bg-[#f3f0ff] transition text-sm sm:text-base"
									>
										← Tiếp tục xem sản phẩm
									</a>
									<button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold shadow hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-sm sm:text-base">
										Cập nhật giỏ hàng
									</button>
								</div>
							</div>
						</div>
						{/* Right: Đơn hàng */}
						<div className="w-full md:w-[350px] flex-shrink-0 mt-6 md:mt-0">
							<div className="bg-white rounded-xl shadow p-3 sm:p-6 sticky top-8">
								<h2 className="font-semibold text-[#1d3557] mb-4 text-base sm:text-lg">
									Đơn hàng của bạn
								</h2>
								<div className="border-b pb-2 mb-2">
									{cartItems.map((item) => (
										<div
											key={item.id}
											className="flex justify-between items-center text-xs sm:text-sm mb-1"
										>
											<span>
												{item.name}{" "}
												<span className="text-gray-400">× {item.quantity}</span>
											</span>
											<span className="font-semibold text-[#457b9d]">
												{formatVND(item.price * item.quantity)}
											</span>
										</div>
									))}
								</div>
								<div className="flex justify-between text-xs sm:text-sm mb-1">
									<span className="text-gray-500">Tổng phụ</span>
									<span>{formatVND(total)}</span>
								</div>
								{discount > 0 && (
									<div className="flex justify-between text-xs sm:text-sm mb-1">
										<span className="text-green-600">Đã giảm</span>
										<span>-{formatVND(discount)}</span>
									</div>
								)}
								<div className="flex justify-between font-bold text-base sm:text-lg mt-2 mb-4">
									<span>Tổng</span>
									<span className="text-[#7c3aed]">
										{formatVND(totalAfterDiscount)}
									</span>
								</div>
								<form onSubmit={handlePayment} className="space-y-3">
									<div className="mb-2">
										<label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
											<input
												type="radio"
												name="payment"
												value="bank"
												checked={paymentMethod === "bank"}
												onChange={() => setPaymentMethod("bank")}
											/>
											<span>Chuyển khoản ngân hàng</span>
										</label>
									</div>
									{paymentMethod === "bank" && (
										<div className="bg-[#eaf3f7] rounded p-3 text-xs text-[#1d3557] mb-2">
											<div className="font-semibold mb-1">
												Thông tin chuyển khoản:
											</div>
											<div>
												Ngân hàng: <b>VCB</b> - Chủ TK: <b>Nguyễn Văn A</b>
											</div>
											<div>
												Số tài khoản: <b>0123456789</b>
											</div>
											<div>
												Nội dung: <b>Thanh toán đơn hàng [Tên bạn]</b>
											</div>
											<div className="mt-1 text-gray-500">
												Đơn hàng sẽ được giao sau khi xác nhận chuyển khoản.
											</div>
										</div>
									)}
									<button
										type="submit"
										className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#38bdf8] text-white font-semibold shadow hover:from-[#6d28d9] hover:to-[#0ea5e9] transition text-base sm:text-lg"
									>
										Đặt hàng
									</button>
								</form>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
