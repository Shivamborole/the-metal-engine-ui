import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../Services/menu-service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.scss']
})
export class SidebarComponent implements OnInit {

  menu: any[] = [];

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuService.getMenu().subscribe({
      next: (res) => this.menu = this.buildMenuTree(res),
      error: (err) => console.error("Menu load error:", err)
    });
  }

  // Build Parent → Children structure
  buildMenuTree(list: any[]) {
    const map = new Map<string, any>();

    list.forEach(i => map.set(i.id, { ...i, children: [], open: false }));

    const roots: any[] = [];

    list.forEach(i => {
      const node = map.get(i.id);
      if (i.parentId) {
        const parent = map.get(i.parentId);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  // Parent click → navigate or toggle
  onParentClick(item: any) {
    if (!item.children?.length) {
      if (item.route) this.router.navigate([item.route]);
      return;
    }

    item.open = !item.open;
  }
}
