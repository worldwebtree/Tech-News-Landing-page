<?php
// Set error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Function to fetch and parse Google News RSS feed
function fetchTechNews() {
    // Google News RSS feed URL for technology news in the US
    $url = 'https://news.google.com/rss/search?q=technology+programming+AI+machine+learning+cryptocurrency+blockchain+when:24h&hl=en-US&gl=US&ceid=US:en';
    
    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Execute cURL session
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        throw new Exception('Failed to fetch news: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    // Parse XML response
    $xml = simplexml_load_string($response);
    if ($xml === false) {
        throw new Exception('Failed to parse XML response');
    }
    
    $news = [];
    $techKeywords = ['technology', 'programming', 'software', 'artificial intelligence', 'AI', 'machine learning', 
                     'cryptocurrency', 'blockchain', 'tech', 'innovation', 'startup', 'digital', 'computer'];
    
    // Process each news item
    foreach ($xml->channel->item as $item) {
        $title = (string)$item->title;
        $description = (string)$item->description;
        $pubDate = (string)$item->pubDate;
        $link = (string)$item->link;
        
        // Extract source from the title (Google News format: "Title - Source")
        $source = '';
        if (preg_match('/ - ([^-]+)$/', $title, $matches)) {
            $source = trim($matches[1]);
            $title = trim(str_replace(' - ' . $source, '', $title));
        }
        
        // Check if the news item is tech-related
        $isTechRelated = false;
        $titleLower = strtolower($title);
        $descLower = strtolower($description);
        
        foreach ($techKeywords as $keyword) {
            if (strpos($titleLower, strtolower($keyword)) !== false || 
                strpos($descLower, strtolower($keyword)) !== false) {
                $isTechRelated = true;
                break;
            }
        }
        
        if ($isTechRelated) {
            $news[] = [
                'title' => $title,
                'description' => strip_tags($description),
                'source' => $source,
                'pubDate' => date('F j, Y, g:i a', strtotime($pubDate)),
                'link' => $link
            ];
        }
    }
    
    return $news;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech News Today</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">
                <i class="fas fa-newspaper"></i>
                <span>Tech News Today</span>
            </div>
            <div class="nav-links">
                <a href="#" class="active"><i class="fas fa-home"></i> Home</a>
                <a href="#"><i class="fas fa-microchip"></i> Technology</a>
                <a href="#"><i class="fas fa-robot"></i> AI</a>
                <a href="#"><i class="fas fa-code"></i> Programming</a>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero" data-aos="fade-up">
            <h1>Stay Updated with Latest Tech News</h1>
            <p>Your daily dose of technology, programming, and innovation news</p>
            <button class="refresh-button" onclick="location.reload()">
                <i class="fas fa-sync-alt"></i> Refresh News
            </button>
        </section>

        <section class="news-container">
            <?php
            try {
                $news = fetchTechNews();
                
                if (empty($news)) {
                    echo '<div class="no-news" data-aos="fade-up">';
                    echo '<i class="fas fa-exclamation-circle"></i>';
                    echo '<p>No tech news found at the moment. Please try again later.</p>';
                    echo '</div>';
                } else {
                    foreach ($news as $index => $item) {
                        echo '<article class="news-item" data-aos="fade-up" data-aos-delay="' . ($index * 100) . '">';
                        echo '<div class="news-content">';
                        echo '<h2><a href="' . htmlspecialchars($item['link']) . '" target="_blank">' . htmlspecialchars($item['title']) . '</a></h2>';
                        echo '<div class="news-meta">';
                        echo '<span class="source"><i class="fas fa-newspaper"></i> ' . htmlspecialchars($item['source']) . '</span>';
                        echo '<span class="date"><i class="fas fa-clock"></i> ' . htmlspecialchars($item['pubDate']) . '</span>';
                        echo '</div>';
                        echo '<div class="description">' . htmlspecialchars($item['description']) . '</div>';
                        echo '</div>';
                        echo '<div class="news-actions">';
                        echo '<a href="' . htmlspecialchars($item['link']) . '" target="_blank" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>';
                        echo '</div>';
                        echo '</article>';
                    }
                }
            } catch (Exception $e) {
                echo '<div class="error-message" data-aos="fade-up">';
                echo '<i class="fas fa-exclamation-triangle"></i>';
                echo '<p>Error: ' . htmlspecialchars($e->getMessage()) . '</p>';
                echo '</div>';
            }
            ?>
        </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section" data-aos="fade-up">
                <h3><i class="fas fa-info-circle"></i> About Us</h3>
                <p>Your trusted source for the latest technology news and updates.</p>
            </div>
            <div class="footer-section" data-aos="fade-up" data-aos-delay="100">
                <h3><i class="fas fa-link"></i> Quick Links</h3>
                <ul>
                    <li><a href="#"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="#"><i class="fas fa-microchip"></i> Technology</a></li>
                    <li><a href="#"><i class="fas fa-robot"></i> AI</a></li>
                    <li><a href="#"><i class="fas fa-code"></i> Programming</a></li>
                </ul>
            </div>
            <div class="footer-section" data-aos="fade-up" data-aos-delay="200">
                <h3><i class="fas fa-share-alt"></i> Connect With Us</h3>
                <div class="social-links">
                    <a href="#" title="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" title="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="#" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    <a href="#" title="GitHub"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>Design and Develop by WorldWebTree <i class="fas fa-heart"></i></p>
            <p>&copy; <?php echo date("Y"); ?> Tech News Today. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="script.js"></script>
</body>
</html> 