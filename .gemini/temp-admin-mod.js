      if (res.ok) {
        const { url } = await res.json();
        
        if (isNew) {
          setNewForm(f => ({ ...f, imageUrl: url }));
        } else if (editingId) {
          // Immediately save to DB as requested by user
          await fetch(`/api/admin/products/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: url })
          });
          
          setEditForm(f => ({ ...f, imageUrl: url }));
          
          // Refresh products to show new image in the list view immediately
          fetchProducts();
        }
      }
