// utils/profilePicSelector.ts

export function getProfilePictureUrl(profilePicKey: string): string {
    const profilePics: Record<string, string> = {
      "default": "https://th.bing.com/th/id/OIP.6UhgwprABi3-dz8Qs85FvwHaHa?rs=1&pid=ImgDetMain",
      "kojima": "https://th.bing.com/th/id/OIP.P4sJ7dRQnHGABZrJZPIYjQHaHa?rs=1&pid=ImgDetMain",
      "dog": "https://cdn-icons-png.flaticon.com/512/616/616430.png",
      "ninja": "https://cdn-icons-png.flaticon.com/512/616/616494.png",
      "robot": "https://cdn-icons-png.flaticon.com/512/616/616408.png",
      "wizard": "https://cdn-icons-png.flaticon.com/512/616/616408.png",
      "alien": "https://cdn-icons-png.flaticon.com/512/616/616408.png",
      // Añade más claves y URLs aquí
    };
  
    return profilePics[profilePicKey] || "https://th.bing.com/th/id/OIP.6UhgwprABi3-dz8Qs85FvwHaHa?rs=1&pid=ImgDetMain";
  }
  