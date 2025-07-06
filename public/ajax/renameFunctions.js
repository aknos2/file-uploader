let currentEditingFileId = null;
let currentEditingFolderId = null;

    function openFileNameModal(fileId, currentName) {
      currentEditingFileId = fileId;
      document.getElementById('modalFileName').value = currentName;
      document.getElementById('editFileNameOverlay').classList.remove('hidden');
      document.getElementById('modalFileName').focus();
    }

    function closeFileNameModal() {
      currentEditingFileId = null;
      document.getElementById('modalFileName').value = "";
      document.getElementById('editFileNameOverlay').classList.add('hidden');
    }

    document.getElementById('editFileNameForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('modalFileName').value.trim();
      if (!newName) return alert("File name cannot be empty");

      try {
        const res = await fetch(`/${currentEditingFileId}/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
        
        const data = await res.json();
        
        if (data.success) {
          location.reload();
        } else {
          alert(data.error || "Rename failed");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    });
    
    window.addEventListener('keydown', function (e) {
      if (e.key === "Escape") closeFileNameModal();
    });


    function openFolderRenameModal(folderId, currentName) {
      currentEditingFolderId = folderId;
      document.getElementById('modalFolderName').value = currentName;
      document.getElementById('editFolderNameOverlay').classList.remove('hidden');
      document.getElementById('modalFolderName').focus();
    }
    
    function closeFolderNameModal() {
      currentEditingFolderId = null;
      document.getElementById('modalFolderName').value = "";
      document.getElementById('editFolderNameOverlay').classList.add('hidden');
    }
    
    document.getElementById('editFolderNameForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('modalFolderName').value.trim();
      if (!newName) return alert("Folder name cannot be empty");
    
      try {
        const res = await fetch(`/folder/${currentEditingFolderId}/edit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
      
        const data = await res.json();
      
        if (data.success) {
          location.reload();
        } else {
          alert(data.error || "Rename failed");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    });