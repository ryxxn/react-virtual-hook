# use-virtual-list

---

A lightweight and efficient React Hook for rendering large lists using virtualization. 🚀

---

## 📦 Installation

You can install `use-virtual-list` via **npm** or **yarn**:

```sh
npm install use-virtual-list
# or
yarn add use-virtual-list
```

---

## 🚀 Features

✅ Optimized Rendering: Only renders visible items to improve performance.

✅ Supports Infinite Scrolling: Load more data dynamically.

✅ Customizable Buffers: Control how many extra items are preloaded.

✅ Smooth Scrolling Experience: Prevents flickering during fast scrolling.

✅ Lightweight: No external dependencies required!

---

## 📖 Usage

🔹 Basic Example

```tsx
import { useVirtualList } from "use-virtual-list";

const MyList = () => {
  const virtualizeManager = useVirtualList({
    data: Array.from({ length: 10000 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
    height: 500,
    rowHeight: 50,
  });

  return (
    <div ref={containerRef} style={virtualizedManager.getContainerStyle()}>
      <ul style={virtualizedManager.getListStyle()}>
        {visibleData.map((item, index) => (
          <li
            key={item.id}
            style={virtualizedManager.getRowStyle(index)}
            className="border p-2"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🛠 Customization

You can customize the buffer size for smoother scrolling:

```tsx
const { visibleData, containerRef, getRowStyle } = useVirtualList({
  data,
  height: 600,
  rowHeight: 40,
  buffer: 15, // Preload 15 items above and below (default=10)
});
```

---

## ❓ FAQ

🔹 How does this improve performance?
Instead of rendering thousands of elements, useVirtualList only renders the items currently visible + buffer items.

🔹 Can I use this with tables?
Yes! You can wrap a `<tbody>` inside a virtualized list for efficient table rendering.

```tsx
<table
  className="w-full border-collapse"
  ref={containerRef}
  style={virtualizedManager.getContainerStyle()}
>
  <thead className="sticky top-0 bg-gray-200 border-b">
    <tr>
      <th className="p-2 border">ID</th>
      <th className="p-2 border">Name</th>
    </tr>
  </thead>
  <tbody style={virtualizedManager.getListStyle()}>
    {visibleData.map((row, index) => (
      <tr key={row.id} style={virtualizedManager.getRowStyle(index)}>
        <td className="p-2 border">{row.id}</td>
        <td className="p-2 border">{row.name}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## 🤝 Contributing

If you find a bug or want to improve this library, feel free to submit an issue or PR on GitHub! 🚀
