package server

type BlogFrontmatter struct {
	Title         string `json:"title"`
	Slug          string `json:"slug"`
	Author        string `json:"author"`
	Featured      bool   `json:"featured"`
	FeatureImage  string `json:"featureImage"`
	PublishedDate string `json:"publishedDate"`
	Excerpt       string `json:"excerpt"`
}
