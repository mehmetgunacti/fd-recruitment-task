import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home-page',
    templateUrl: './home.page.html',
    imports: [RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage { }
