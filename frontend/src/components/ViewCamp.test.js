import { render, screen, waitFor} from '@testing-library/react';
import ViewCamp from './ViewCamp';

test('ViewCamp should display loading campground information until the campground data is loaded', () => {
    render(<ViewCamp/>)

    const loadingText = screen.getByText("Loading camp details...")
});

